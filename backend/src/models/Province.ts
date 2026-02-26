import mongoose, { Schema, Document } from "mongoose";

export interface IProvince extends Document {
  id: string;
  slug: string;
  name: string;
  nameVi: string;
  region: "mien-bac" | "mien-trung" | "mien-nam";
  description: string;
  longDescription: string;
  heroImage: string;
  thumbnail: string;
  population?: string;
  area?: string;
  bestTimeToVisit?: string;
  highlights: string[];
  destinationSlugs: string[];
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const provinceSchema = new Schema<IProvince>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    nameVi: { type: String, required: true },
    region: {
      type: String,
      required: true,
      enum: ["mien-bac", "mien-trung", "mien-nam"],
    },
    description: { type: String, required: true },
    longDescription: { type: String, required: true },
    heroImage: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    population: { type: String },
    area: { type: String },
    bestTimeToVisit: { type: String },
    highlights: [{ type: String }],
    destinationSlugs: [{ type: String }],
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
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

export const Province = mongoose.model<IProvince>("Province", provinceSchema);
