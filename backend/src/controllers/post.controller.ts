import { Request, Response, NextFunction } from "express";
import { Post } from "../models/Post";
import { User } from "../models/User";
import { Notification } from "../models/Notification";
import { AppError } from "../middleware/errorHandler";

export async function getAllPosts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { page = "1", limit = "12", category, tag } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = { published: true };
    if (category) filter.category = category;
    if (tag) filter.tags = tag;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .select("-content")
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Post.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: posts,
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

export async function getPostBySlug(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug, published: true },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!post) {
      throw new AppError("Không tìm thấy bài viết", 404);
    }
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

export async function getRelatedPosts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const current = await Post.findOne({ slug: req.params.slug });
    if (!current) {
      throw new AppError("Không tìm thấy bài viết", 404);
    }

    const related = await Post.find({
      slug: { $ne: current.slug },
      published: true,
      $or: [
        { category: current.category },
        { tags: { $in: current.tags } },
      ],
    })
      .select("-content")
      .sort({ publishedAt: -1 })
      .limit(3);

    res.json({ success: true, data: related });
  } catch (err) {
    next(err);
  }
}

export async function getAdjacentPosts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const current = await Post.findOne({
      slug: req.params.slug,
      published: true,
    }).select("publishedAt");

    if (!current) {
      throw new AppError("Không tìm thấy bài viết", 404);
    }

    const [prev, next_] = await Promise.all([
      Post.findOne({
        published: true,
        publishedAt: { $gt: current.publishedAt },
      })
        .sort({ publishedAt: 1 })
        .select("title slug")
        .limit(1),
      Post.findOne({
        published: true,
        publishedAt: { $lt: current.publishedAt },
      })
        .sort({ publishedAt: -1 })
        .select("title slug")
        .limit(1),
    ]);

    res.json({ success: true, data: { prev: prev || null, next: next_ || null } });
  } catch (err) {
    next(err);
  }
}

export async function getLatestPosts(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const posts = await Post.find({ published: true })
      .select("-content")
      .sort({ publishedAt: -1 })
      .limit(4);
    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
}

export async function adminGetAllPosts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const posts = await Post.find()
      .select("-content")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
}

export async function createPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = { ...req.body };
    if (data.published && !data.publishedAt) {
      data.publishedAt = new Date();
    }
    const post = await Post.create(data);

    // Create notifications for all users when post is published
    if (post.published) {
      try {
        const users = await User.find().select("_id");
        const notifications = users.map((u) => ({
          userId: u._id,
          type: "new_post" as const,
          title: "Bài viết mới",
          message: post.title,
          link: `/bai-viet/${post.slug}`,
        }));
        if (notifications.length > 0) {
          await Notification.insertMany(notifications);
        }
      } catch {
        // Don't fail post creation if notification fails
      }
    }

    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

export async function updatePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const existing = await Post.findOne({ slug: req.params.slug });
    if (!existing) {
      throw new AppError("Không tìm thấy bài viết", 404);
    }

    const data = { ...req.body };
    if (data.published && !existing.published && !data.publishedAt) {
      data.publishedAt = new Date();
    }

    const wasPublished = existing.published;
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      data,
      { new: true, runValidators: true }
    );

    // Notify users when a post is newly published
    if (!wasPublished && data.published && post) {
      try {
        const users = await User.find().select("_id");
        const notifications = users.map((u) => ({
          userId: u._id,
          type: "new_post" as const,
          title: "Bài viết mới",
          message: post.title,
          link: `/bai-viet/${post.slug}`,
        }));
        if (notifications.length > 0) {
          await Notification.insertMany(notifications);
        }
      } catch {
        // Don't fail post update if notification fails
      }
    }

    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

export async function bulkUpdatePosts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { slugs, action } = req.body as { slugs: string[]; action: string };
    if (!slugs || !Array.isArray(slugs) || slugs.length === 0) {
      throw new AppError("Danh sách bài viết trống", 400);
    }

    let result;
    switch (action) {
      case "publish":
        result = await Post.updateMany(
          { slug: { $in: slugs } },
          { published: true, publishedAt: new Date() }
        );
        break;
      case "unpublish":
        result = await Post.updateMany(
          { slug: { $in: slugs } },
          { published: false }
        );
        break;
      case "delete":
        result = await Post.deleteMany({ slug: { $in: slugs } });
        break;
      default:
        throw new AppError("Action không hợp lệ", 400);
    }

    const count = "modifiedCount" in result ? result.modifiedCount : "deletedCount" in result ? result.deletedCount : 0;
    res.json({
      success: true,
      message: `Đã ${action} ${count} bài viết`,
    });
  } catch (err) {
    next(err);
  }
}

export async function deletePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const post = await Post.findOneAndDelete({ slug: req.params.slug });
    if (!post) {
      throw new AppError("Không tìm thấy bài viết", 404);
    }
    res.json({ success: true, message: "Đã xoá bài viết thành công" });
  } catch (err) {
    next(err);
  }
}
