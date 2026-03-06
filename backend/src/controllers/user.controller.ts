import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { AppError } from "../middleware/errorHandler";
import { Story } from "../models/Story";
import { Itinerary } from "../models/Itinerary";
import { checkAndAwardBadges, BADGE_DEFINITIONS } from "../lib/badges";

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
    const { displayName, bio, avatar, isPublicProfile } = req.body;
    const update: Record<string, unknown> = {};
    if (displayName !== undefined) update.displayName = displayName;
    if (bio !== undefined) update.bio = bio;
    if (avatar !== undefined) update.avatar = avatar;
    if (isPublicProfile !== undefined) update.isPublicProfile = isPublicProfile;

    const user = await User.findByIdAndUpdate(
      req.user!._id,
      update,
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
    checkAndAwardBadges(user._id.toString()).catch(() => {});

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

export async function getPublicProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user || !user.isPublicProfile) {
      throw new AppError("Không tìm thấy profile", 404);
    }

    const [storyCount, stories, itineraryCount, itineraries] = await Promise.all([
      Story.countDocuments({ userId: user._id, status: "approved" }),
      Story.find({ userId: user._id, status: "approved" })
        .sort({ createdAt: -1 })
        .limit(5),
      Itinerary.countDocuments({ userId: user._id, isPublic: true }),
      Itinerary.find({ userId: user._id, isPublic: true })
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.json({
      success: true,
      data: {
        user: {
          username: user.username,
          displayName: user.displayName,
          bio: user.bio,
          avatar: user.avatar,
          badges: user.badges,
          createdAt: user.createdAt,
        },
        stats: {
          storyCount,
          itineraryCount,
          favoriteCount: user.favorites.length,
        },
        stories,
        itineraries,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getMyBadges(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.user!._id).select("badges");
    if (!user) throw new AppError("Người dùng không tồn tại", 404);

    const badges = user.badges.map((id) => ({
      id,
      ...(BADGE_DEFINITIONS[id] || { name: id, icon: "🏅", description: "" }),
    }));

    res.json({ success: true, data: badges });
  } catch (err) {
    next(err);
  }
}
