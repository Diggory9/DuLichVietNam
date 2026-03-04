import { Request, Response, NextFunction } from "express";
import { Destination } from "../models/Destination";
import { Province } from "../models/Province";
import { AppError } from "../middleware/errorHandler";
import { haversineDistance } from "../utils/distance";

export async function getAllDestinations(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const destinations = await Destination.find().sort({ order: 1 });
    res.json({ success: true, data: destinations });
  } catch (err) {
    next(err);
  }
}

export async function getFeaturedDestinations(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const destinations = await Destination.find({ featured: true }).sort({
      order: 1,
    });
    res.json({ success: true, data: destinations });
  } catch (err) {
    next(err);
  }
}

export async function getDestinationBySlug(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const destination = await Destination.findOne({ slug: req.params.slug });
    if (!destination) {
      throw new AppError("Không tìm thấy địa danh", 404);
    }
    res.json({ success: true, data: destination });
  } catch (err) {
    next(err);
  }
}

export async function getRelatedDestinations(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const current = await Destination.findOne({ slug: req.params.slug });
    if (!current) {
      throw new AppError("Không tìm thấy địa danh", 404);
    }

    const related = await Destination.find({
      slug: { $ne: current.slug },
      $or: [
        { provinceSlug: current.provinceSlug },
        { category: current.category },
      ],
    })
      .sort({ order: 1 })
      .limit(3);

    res.json({ success: true, data: related });
  } catch (err) {
    next(err);
  }
}

export async function getDestinationsByProvince(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const destinations = await Destination.find({
      provinceSlug: req.params.slug,
    }).sort({ order: 1 });
    res.json({ success: true, data: destinations });
  } catch (err) {
    next(err);
  }
}

export async function createDestination(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json({ success: true, data: destination });
  } catch (err) {
    next(err);
  }
}

export async function updateDestination(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const destination = await Destination.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, runValidators: true }
    );
    if (!destination) {
      throw new AppError("Không tìm thấy địa danh", 404);
    }
    res.json({ success: true, data: destination });
  } catch (err) {
    next(err);
  }
}

export async function deleteDestination(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const destination = await Destination.findOneAndDelete({
      slug: req.params.slug,
    });
    if (!destination) {
      throw new AppError("Không tìm thấy địa danh", 404);
    }
    res.json({ success: true, message: "Đã xoá địa danh thành công" });
  } catch (err) {
    next(err);
  }
}

export async function searchDestinations(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      q,
      category,
      region,
      province,
      sort = "order",
      page = "1",
      limit = "12",
      minRating,
      priceRange,
      nearLat,
      nearLng,
      maxDistance,
    } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = {};

    if (q) {
      const regex = { $regex: q, $options: "i" };
      filter.$or = [
        { name: regex },
        { nameVi: regex },
        { description: regex },
        { tags: regex },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (province) {
      filter.provinceSlug = province;
    }

    if (region) {
      const provinces = await Province.find({ region }).select("slug");
      const provinceSlugs = provinces.map((p) => p.slug);
      filter.provinceSlug = { $in: provinceSlugs };
    }

    // Rating filter
    if (minRating) {
      const rating = parseFloat(minRating);
      if (!isNaN(rating) && rating >= 1 && rating <= 5) {
        filter.averageRating = { $gte: rating };
      }
    }

    // Price range filter
    if (priceRange) {
      switch (priceRange) {
        case "free":
          filter.entryFeeValue = 0;
          break;
        case "under100k":
          filter.entryFeeValue = { $gt: 0, $lt: 100000 };
          break;
        case "100k-500k":
          filter.entryFeeValue = { $gte: 100000, $lte: 500000 };
          break;
        case "over500k":
          filter.entryFeeValue = { $gt: 500000 };
          break;
      }
    }

    // Distance bounding box filter
    const userLat = nearLat ? parseFloat(nearLat) : NaN;
    const userLng = nearLng ? parseFloat(nearLng) : NaN;
    const maxDist = maxDistance ? parseFloat(maxDistance) : NaN;

    if (!isNaN(userLat) && !isNaN(userLng) && !isNaN(maxDist)) {
      const latDelta = maxDist / 111;
      const lngDelta = maxDist / (111 * Math.cos((userLat * Math.PI) / 180));
      filter["coordinates.lat"] = { $gte: userLat - latDelta, $lte: userLat + latDelta };
      filter["coordinates.lng"] = { $gte: userLng - lngDelta, $lte: userLng + lngDelta };
    }

    const sortOptions: Record<string, Record<string, 1 | -1>> = {
      order: { order: 1 },
      name: { name: 1 },
      newest: { createdAt: -1 },
      featured: { featured: -1, order: 1 },
      rating: { averageRating: -1, reviewCount: -1 },
    };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));

    // Distance sort: fetch all matching, sort by distance, then paginate
    if (sort === "distance" && !isNaN(userLat) && !isNaN(userLng)) {
      const allMatching = await Destination.find(filter);
      const withDistance = allMatching
        .filter((d) => d.coordinates?.lat && d.coordinates?.lng)
        .map((d) => ({
          doc: d,
          distance: haversineDistance(userLat, userLng, d.coordinates!.lat, d.coordinates!.lng),
        }))
        .filter((item) => !isNaN(maxDist) ? item.distance <= maxDist : true)
        .sort((a, b) => a.distance - b.distance);

      const total = withDistance.length;
      const skip = (pageNum - 1) * limitNum;
      const paginated = withDistance.slice(skip, skip + limitNum).map((item) => item.doc);

      return res.json({
        success: true,
        data: paginated,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    }

    const skip = (pageNum - 1) * limitNum;

    const [destinations, total] = await Promise.all([
      Destination.find(filter)
        .sort(sortOptions[sort] || sortOptions.order)
        .skip(skip)
        .limit(limitNum),
      Destination.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: destinations,
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

export async function getDestinationsForMap(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const destinations = await Destination.find({
      "coordinates.lat": { $exists: true },
      "coordinates.lng": { $exists: true },
    }).select("slug name nameVi coordinates category images");

    const data = destinations.map((d) => ({
      slug: d.slug,
      name: d.name,
      nameVi: d.nameVi,
      coordinates: d.coordinates,
      category: d.category,
      image: d.images[0]?.src || null,
    }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function quickSearch(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { q } = req.query as Record<string, string>;
    if (!q || q.trim().length === 0) {
      return res.json({ success: true, data: { destinations: [], provinces: [] } });
    }

    const regex = { $regex: q, $options: "i" };

    const [destinations, provinces] = await Promise.all([
      Destination.find({
        $or: [{ name: regex }, { nameVi: regex }],
      })
        .select("name slug images category")
        .limit(5),
      Province.find({
        $or: [{ name: regex }, { nameVi: regex }],
      })
        .select("name slug thumbnail")
        .limit(3),
    ]);

    res.json({ success: true, data: { destinations, provinces } });
  } catch (err) {
    next(err);
  }
}
