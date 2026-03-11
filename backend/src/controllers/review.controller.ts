import { Request, Response, NextFunction } from "express";
import { Review } from "../models/Review";
import { Destination } from "../models/Destination";
import { Hotel } from "../models/Hotel";
import { Tour } from "../models/Tour";
import { AppError } from "../middleware/errorHandler";

async function recalculateRating(destinationSlug: string) {
  const result = await Review.aggregate([
    { $match: { destinationSlug } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await Destination.findOneAndUpdate(
      { slug: destinationSlug },
      {
        averageRating: Math.round(result[0].averageRating * 10) / 10,
        reviewCount: result[0].reviewCount,
      }
    );
  } else {
    await Destination.findOneAndUpdate(
      { slug: destinationSlug },
      { averageRating: 0, reviewCount: 0 }
    );
  }
}

async function recalculateTargetRating(targetType: string, targetSlug: string) {
  const result = await Review.aggregate([
    { $match: { targetType, targetSlug } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const updateData = result.length > 0
    ? {
        averageRating: Math.round(result[0].averageRating * 10) / 10,
        reviewCount: result[0].reviewCount,
      }
    : { averageRating: 0, reviewCount: 0 };

  switch (targetType) {
    case "destination":
      await Destination.findOneAndUpdate({ slug: targetSlug }, updateData);
      break;
    case "hotel":
      await Hotel.findOneAndUpdate({ slug: targetSlug }, updateData);
      break;
    case "tour":
      await Tour.findOneAndUpdate({ slug: targetSlug }, updateData);
      break;
  }
}

export async function getReviewsByDestination(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const reviews = await Review.find({ destinationSlug: req.params.destinationSlug })
      .select("-email")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
}

export async function getReviewsByTarget(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const targetType = req.params.targetType as string;
    const targetSlug = req.params.targetSlug as string;

    if (!["destination", "hotel", "tour"].includes(targetType)) {
      throw new AppError("Loại đánh giá không hợp lệ", 400);
    }

    const reviews = await Review.find({ targetType, targetSlug })
      .select("-email")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
}

export async function createReview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { destinationSlug, name, email, rating, content } = req.body;
    if (!destinationSlug || !name || !email || !rating) {
      throw new AppError("Vui lòng điền đầy đủ thông tin", 400);
    }
    if (rating < 1 || rating > 5) {
      throw new AppError("Đánh giá phải từ 1 đến 5 sao", 400);
    }

    const destination = await Destination.findOne({ slug: destinationSlug });
    if (!destination) {
      throw new AppError("Không tìm thấy địa danh", 404);
    }

    let review;
    try {
      review = await Review.create({
        destinationSlug,
        targetType: "destination",
        targetSlug: destinationSlug,
        name,
        email,
        rating,
        content,
      });
    } catch (err: unknown) {
      if (err && typeof err === "object" && "code" in err && (err as { code: number }).code === 11000) {
        throw new AppError("Bạn đã đánh giá địa danh này rồi", 400);
      }
      throw err;
    }

    await recalculateRating(destinationSlug);
    await recalculateTargetRating("destination", destinationSlug);

    const result = review.toJSON();
    delete (result as Record<string, unknown>).email;
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function createAuthenticatedReview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;
    if (!user) {
      throw new AppError("Chưa đăng nhập", 401);
    }

    const { targetType, targetSlug, rating, content } = req.body;

    if (!targetType || !targetSlug || !rating) {
      throw new AppError("Vui lòng điền đầy đủ thông tin", 400);
    }
    if (!["destination", "hotel", "tour"].includes(targetType)) {
      throw new AppError("Loại đánh giá không hợp lệ", 400);
    }
    if (rating < 1 || rating > 5) {
      throw new AppError("Đánh giá phải từ 1 đến 5 sao", 400);
    }

    const reviewData: Record<string, unknown> = {
      targetType,
      targetSlug,
      userId: user._id,
      name: user.displayName || user.username,
      email: user.email,
      rating,
      content,
    };

    // For destination reviews, also set destinationSlug for backward compat
    if (targetType === "destination") {
      reviewData.destinationSlug = targetSlug;
    }

    let review;
    try {
      review = await Review.create(reviewData);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "code" in err && (err as { code: number }).code === 11000) {
        throw new AppError("Bạn đã đánh giá mục này rồi", 400);
      }
      throw err;
    }

    await recalculateTargetRating(targetType, targetSlug);

    // Also recalculate old-style rating for destinations
    if (targetType === "destination") {
      await recalculateRating(targetSlug);
    }

    const result = review.toJSON();
    delete (result as Record<string, unknown>).email;
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function adminGetAllReviews(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.destinationSlug) filter.destinationSlug = req.query.destinationSlug;
    if (req.query.targetType) filter.targetType = req.query.targetType;
    if (req.query.targetSlug) filter.targetSlug = req.query.targetSlug;

    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
}

export async function deleteReview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) throw new AppError("Không tìm thấy đánh giá", 404);

    // Recalculate using the new targetType system
    if (review.targetType && review.targetSlug) {
      await recalculateTargetRating(review.targetType, review.targetSlug);
    }

    // Also recalculate old-style for destinations
    if (review.destinationSlug) {
      await recalculateRating(review.destinationSlug);
    }

    res.json({ success: true, message: "Đã xoá đánh giá" });
  } catch (err) {
    next(err);
  }
}
