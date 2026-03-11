import mongoose, { Schema, Document } from "mongoose";

export interface ITourScheduleDay {
  dayNumber: number;
  title: string;
  description: string;
  destinationSlugs: string[];
}

export interface ITour extends Document {
  id: string;
  slug: string;
  name: string;
  nameVi: string;
  destinationSlugs: string[];
  provinceSlug: string;
  category: "van-hoa" | "thien-nhien" | "phieu-luu" | "am-thuc" | "lich-su" | "ket-hop";
  description: string;
  longDescription: string;
  images: { src: string; alt: string; caption?: string }[];
  duration: { days: number; nights: number };
  price: number;
  discountPrice?: number;
  maxGroupSize: number;
  schedule: ITourScheduleDay[];
  includes: string[];
  excludes: string[];
  highlights: string[];
  departureLocation?: string;
  difficulty?: "de" | "trung-binh" | "kho";
  featured: boolean;
  order: number;
  averageRating: number;
  reviewCount: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const tourScheduleDaySchema = new Schema<ITourScheduleDay>(
  {
    dayNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    destinationSlugs: [{ type: String }],
  },
  { _id: false }
);

const tourImageSchema = new Schema(
  {
    src: { type: String, required: true },
    alt: { type: String, required: true },
    caption: { type: String },
  },
  { _id: false }
);

const tourSchema = new Schema<ITour>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    nameVi: { type: String, required: true },
    destinationSlugs: [{ type: String }],
    provinceSlug: { type: String, required: true, index: true },
    category: {
      type: String,
      required: true,
      enum: ["van-hoa", "thien-nhien", "phieu-luu", "am-thuc", "lich-su", "ket-hop"],
    },
    description: { type: String, required: true },
    longDescription: { type: String, required: true },
    images: [tourImageSchema],
    duration: {
      days: { type: Number, required: true },
      nights: { type: Number, required: true },
    },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    maxGroupSize: { type: Number, required: true, default: 20 },
    schedule: [tourScheduleDaySchema],
    includes: [{ type: String }],
    excludes: [{ type: String }],
    highlights: [{ type: String }],
    departureLocation: { type: String },
    difficulty: {
      type: String,
      enum: ["de", "trung-binh", "kho"],
    },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

tourSchema.index({ provinceSlug: 1, category: 1 });

export const Tour = mongoose.model<ITour>("Tour", tourSchema);
