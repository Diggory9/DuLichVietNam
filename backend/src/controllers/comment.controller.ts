import { Request, Response, NextFunction } from "express";
import { Comment } from "../models/Comment";
import { Post } from "../models/Post";
import { AppError } from "../middleware/errorHandler";

export async function getCommentsByPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const comments = await Comment.find({ postSlug: req.params.postSlug })
      .select("-email")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: comments });
  } catch (err) {
    next(err);
  }
}

export async function createComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { postSlug, name, email, content } = req.body;
    if (!postSlug || !name || !email || !content) {
      throw new AppError("Vui lòng điền đầy đủ thông tin", 400);
    }

    const post = await Post.findOne({ slug: postSlug, published: true });
    if (!post) {
      throw new AppError("Không tìm thấy bài viết", 404);
    }

    const comment = await Comment.create({ postSlug, name, email, content });
    // Return without email for public display
    const result = comment.toJSON();
    delete (result as Record<string, unknown>).email;
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function adminGetAllComments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.postSlug) filter.postSlug = req.query.postSlug;

    const comments = await Comment.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: comments });
  } catch (err) {
    next(err);
  }
}

export async function bulkDeleteComments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { ids } = req.body as { ids: string[] };
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new AppError("Danh sách bình luận trống", 400);
    }

    const result = await Comment.deleteMany({ _id: { $in: ids } });
    res.json({
      success: true,
      message: `Đã xoá ${result.deletedCount} bình luận`,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) throw new AppError("Không tìm thấy bình luận", 404);
    res.json({ success: true, message: "Đã xoá bình luận" });
  } catch (err) {
    next(err);
  }
}
