import { Request, Response, NextFunction } from "express";
import { Story } from "../models/Story";
import { AppError } from "../middleware/errorHandler";
import slugify from "../utils/slugify";
import { checkAndAwardBadges } from "../lib/badges";

// Public: get approved stories with pagination
export async function getApprovedStories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      page = "1",
      limit = "12",
      destinationSlug,
    } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = { status: "approved" };
    if (destinationSlug) filter.destinationSlug = destinationSlug;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [stories, total] = await Promise.all([
      Story.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Story.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: stories,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
}

// Public: get story by slug (approved only)
export async function getStoryBySlug(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const story = await Story.findOne({
      slug: req.params.slug,
      status: "approved",
    });
    if (!story) {
      throw new AppError("Không tìm thấy câu chuyện", 404);
    }
    res.json({ success: true, data: story });
  } catch (err) {
    next(err);
  }
}

// Public: community gallery (photos from approved stories)
export async function getCommunityGallery(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { page = "1", limit = "24" } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));

    const stories = await Story.find({ status: "approved", "photos.0": { $exists: true } })
      .select("photos title slug authorName")
      .sort({ createdAt: -1 });

    const allPhotos = stories.flatMap((s) =>
      s.photos.map((p) => ({
        src: p.src,
        caption: p.caption,
        storyTitle: s.title,
        storySlug: s.slug,
        authorName: s.authorName,
      }))
    );

    const total = allPhotos.length;
    const skip = (pageNum - 1) * limitNum;
    const paginated = allPhotos.slice(skip, skip + limitNum);

    res.json({
      success: true,
      data: paginated,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
}

// Auth: create story
export async function createStory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const { title, content, destinationSlug, photos, visitDate, rating } = req.body;

    if (!title || !content) {
      throw new AppError("Tiêu đề và nội dung là bắt buộc", 400);
    }

    let slug = slugify(title);
    // Ensure unique slug
    const existing = await Story.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const story = await Story.create({
      userId: user._id,
      authorName: user.displayName || user.username,
      title,
      slug,
      content,
      destinationSlug: destinationSlug || undefined,
      photos: photos || [],
      visitDate: visitDate ? new Date(visitDate) : undefined,
      rating: rating || undefined,
      status: "pending",
    });

    res.status(201).json({ success: true, data: story });
  } catch (err) {
    next(err);
  }
}

// Auth: get my stories
export async function getUserStories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const stories = await Story.find({ userId: req.user!._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: stories });
  } catch (err) {
    next(err);
  }
}

// Auth: update own story
export async function updateStory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const story = await Story.findOne({ slug: req.params.slug });
    if (!story) {
      throw new AppError("Không tìm thấy câu chuyện", 404);
    }
    if (story.userId.toString() !== req.user!._id.toString()) {
      throw new AppError("Bạn không có quyền sửa câu chuyện này", 403);
    }

    const { title, content, destinationSlug, photos, visitDate, rating } = req.body;
    if (title) story.title = title;
    if (content) story.content = content;
    if (destinationSlug !== undefined) story.destinationSlug = destinationSlug;
    if (photos) story.photos = photos;
    if (visitDate !== undefined) story.visitDate = visitDate ? new Date(visitDate) : undefined;
    if (rating !== undefined) story.rating = rating;

    // Reset to pending if content changed
    story.status = "pending";
    await story.save();

    res.json({ success: true, data: story });
  } catch (err) {
    next(err);
  }
}

// Auth: delete own story
export async function deleteStory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const story = await Story.findOne({ slug: req.params.slug });
    if (!story) {
      throw new AppError("Không tìm thấy câu chuyện", 404);
    }
    if (story.userId.toString() !== req.user!._id.toString() && req.user!.role !== "admin") {
      throw new AppError("Bạn không có quyền xoá câu chuyện này", 403);
    }

    await Story.deleteOne({ _id: story._id });
    res.json({ success: true, message: "Đã xoá câu chuyện" });
  } catch (err) {
    next(err);
  }
}

// Auth: toggle like
export async function likeStory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const story = await Story.findOne({ slug: req.params.slug, status: "approved" });
    if (!story) {
      throw new AppError("Không tìm thấy câu chuyện", 404);
    }

    const userId = req.user!._id.toString();
    const idx = story.likes.indexOf(userId);

    if (idx === -1) {
      story.likes.push(userId);
    } else {
      story.likes.splice(idx, 1);
    }
    story.likeCount = story.likes.length;
    await story.save();

    res.json({
      success: true,
      data: { liked: idx === -1, likeCount: story.likeCount },
    });
  } catch (err) {
    next(err);
  }
}

// Admin: get all stories
export async function adminGetStories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { status, page = "1" } = req.query as Record<string, string>;
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = 20;
    const skip = (pageNum - 1) * limitNum;

    const [stories, total] = await Promise.all([
      Story.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Story.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: stories,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
}

// Admin: update story status
export async function adminUpdateStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { status } = req.body;
    if (!["approved", "rejected", "pending"].includes(status)) {
      throw new AppError("Trạng thái không hợp lệ", 400);
    }

    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!story) {
      throw new AppError("Không tìm thấy câu chuyện", 404);
    }

    if (status === "approved") {
      checkAndAwardBadges(story.userId.toString()).catch(() => {});
    }

    res.json({ success: true, data: story });
  } catch (err) {
    next(err);
  }
}
