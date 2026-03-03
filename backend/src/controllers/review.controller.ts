import { Request, Response, NextFunction } from "express";
import { Review } from "../models/Review";
import { Destination } from "../models/Destination";
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
      review = await Review.create({ destinationSlug, name, email, rating, content });
    } catch (err: unknown) {
      if (err && typeof err === "object" && "code" in err && (err as { code: number }).code === 11000) {
        throw new AppError("Bạn đã đánh giá địa danh này rồi", 400);
      }
      throw err;
    }

    await recalculateRating(destinationSlug);

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

    await recalculateRating(review.destinationSlug);
    res.json({ success: true, message: "Đã xoá đánh giá" });
  } catch (err) {
    next(err);
  }
}
