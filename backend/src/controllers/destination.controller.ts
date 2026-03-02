import { Request, Response, NextFunction } from "express";
import { Destination } from "../models/Destination";
import { Province } from "../models/Province";
import { AppError } from "../middleware/errorHandler";

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
      filter.provinceSlug = { ...(filter.provinceSlug ? {} : {}), $in: provinceSlugs };
    }

    const sortOptions: Record<string, Record<string, 1 | -1>> = {
      order: { order: 1 },
      name: { name: 1 },
      newest: { createdAt: -1 },
      featured: { featured: -1, order: 1 },
    };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
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
