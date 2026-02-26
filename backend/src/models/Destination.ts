import mongoose, { Schema, Document } from "mongoose";

export interface IDestinationImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface IDestination extends Document {
  id: string;
  slug: string;
  name: string;
  nameVi: string;
  provinceSlug: string;
  category:
    | "thien-nhien"
    | "lich-su"
    | "van-hoa"
    | "am-thuc"
    | "giai-tri"
    | "tam-linh";
  description: string;
  longDescription: string;
  images: IDestinationImage[];
  tips: string[];
  address?: string;
  coordinates?: { lat: number; lng: number };
  openingHours?: string;
  entryFee?: string;
  bestTimeToVisit?: string;
  tags: string[];
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const destinationImageSchema = new Schema<IDestinationImage>(
  {
    src: { type: String, required: true },
    alt: { type: String, required: true },
    caption: { type: String },
  },
  { _id: false }
);

const destinationSchema = new Schema<IDestination>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    nameVi: { type: String, required: true },
    provinceSlug: { type: String, required: true, index: true },
    category: {
      type: String,
      required: true,
      enum: [
        "thien-nhien",
        "lich-su",
        "van-hoa",
        "am-thuc",
        "giai-tri",
        "tam-linh",
      ],
    },
    description: { type: String, required: true },
    longDescription: { type: String, required: true },
    images: [destinationImageSchema],
    tips: [{ type: String }],
    address: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    openingHours: { type: String },
    entryFee: { type: String },
    bestTimeToVisit: { type: String },
    tags: [{ type: String }],
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

destinationSchema.index({ provinceSlug: 1, category: 1 });

export const Destination = mongoose.model<IDestination>(
  "Destination",
  destinationSchema
);
