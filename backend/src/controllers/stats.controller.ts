import { Request, Response, NextFunction } from "express";
import { Province } from "../models/Province";
import { Destination } from "../models/Destination";
import { Post } from "../models/Post";
import { Contact } from "../models/Contact";
import { Comment } from "../models/Comment";
import { Review } from "../models/Review";
import { User } from "../models/User";
import { Hotel } from "../models/Hotel";
import { Tour } from "../models/Tour";
import { Booking } from "../models/Booking";

export async function getStats(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const [provinceCount, destinationCount, postCount, categories, regions, unreadContacts, commentCount, reviewCount, hotelCount, tourCount, bookingCount] =
      await Promise.all([
        Province.countDocuments(),
        Destination.countDocuments(),
        Post.countDocuments({ published: true }),
        Destination.distinct("category"),
        Province.distinct("region"),
        Contact.countDocuments({ read: false }),
        Comment.countDocuments(),
        Review.countDocuments(),
        Hotel.countDocuments({ active: true }),
        Tour.countDocuments({ active: true }),
        Booking.countDocuments(),
      ]);

    res.json({
      success: true,
      data: {
        provinces: provinceCount,
        destinations: destinationCount,
        posts: postCount,
        categories: categories.length,
        regions: regions.length,
        unreadContacts,
        comments: commentCount,
        reviews: reviewCount,
        hotels: hotelCount,
        tours: tourCount,
        bookings: bookingCount,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getDetailedStats(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Top 10 destinations by reviewCount
    const topDestinations = await Destination.find()
      .sort({ reviewCount: -1 })
      .limit(10)
      .select("name slug reviewCount averageRating");

    // Top 10 posts by views
    const topPosts = await Post.find({ published: true })
      .sort({ views: -1 })
      .limit(10)
      .select("title slug views");

    // Users registered per month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const usersByMonth = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Posts per month (last 6 months)
    const postsByMonth = await Post.aggregate([
      { $match: { published: true, publishedAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$publishedAt" },
            month: { $month: "$publishedAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Category distribution
    const categoryDistribution = await Destination.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        topDestinations,
        topPosts,
        usersByMonth: usersByMonth.map((u) => ({
          month: `${u._id.month}/${u._id.year}`,
          count: u.count,
        })),
        postsByMonth: postsByMonth.map((p) => ({
          month: `${p._id.month}/${p._id.year}`,
          count: p.count,
        })),
        categoryDistribution: categoryDistribution.map((c) => ({
          category: c._id,
          count: c.count,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
}
