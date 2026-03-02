import { Request, Response, NextFunction } from "express";
import { Post } from "../models/Post";
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

    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      data,
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: post });
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
