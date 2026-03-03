import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { AppError } from "../middleware/errorHandler";

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.user!._id);
    if (!user) throw new AppError("Người dùng không tồn tại", 404);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { displayName } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { displayName },
      { new: true, runValidators: true }
    );
    if (!user) throw new AppError("Người dùng không tồn tại", 404);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function getFavorites(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.user!._id).select("favorites");
    if (!user) throw new AppError("Người dùng không tồn tại", 404);
    res.json({ success: true, data: user.favorites });
  } catch (err) {
    next(err);
  }
}

export async function toggleFavorite(req: Request, res: Response, next: NextFunction) {
  try {
    const slug = req.params.slug as string;
    const user = await User.findById(req.user!._id);
    if (!user) throw new AppError("Người dùng không tồn tại", 404);

    const idx = user.favorites.indexOf(slug);
    if (idx === -1) {
      user.favorites.push(slug);
    } else {
      user.favorites.splice(idx, 1);
    }
    await user.save();

    res.json({ success: true, data: user.favorites });
  } catch (err) {
    next(err);
  }
}

export async function syncFavorites(req: Request, res: Response, next: NextFunction) {
  try {
    const { slugs } = req.body;
    if (!Array.isArray(slugs)) {
      throw new AppError("slugs phải là mảng", 400);
    }

    const user = await User.findById(req.user!._id);
    if (!user) throw new AppError("Người dùng không tồn tại", 404);

    // Merge: add slugs from client that aren't already in server
    const merged = new Set([...user.favorites, ...slugs]);
    user.favorites = Array.from(merged);
    await user.save();

    res.json({ success: true, data: user.favorites });
  } catch (err) {
    next(err);
  }
}
