import mongoose, { Schema, Document } from "mongoose";

export interface IHotelRoom {
  name: string;
  type: "standard" | "deluxe" | "suite" | "family";
  price: number;
  maxGuests: number;
  totalRooms: number;
  amenities: string[];
  images: string[];
  available: boolean;
}

export interface IHotel extends Document {
  id: string;
  slug: string;
  name: string;
  nameVi: string;
  destinationSlug?: string;
  provinceSlug: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  stars: number;
  description: string;
  longDescription: string;
  images: { src: string; alt: string; caption?: string }[];
  priceRange: { min: number; max: number };
  amenities: string[];
  rooms: IHotelRoom[];
  contact: { phone?: string; email?: string; website?: string };
  checkInTime?: string;
  checkOutTime?: string;
  policies?: string;
  featured: boolean;
  order: number;
  averageRating: number;
  reviewCount: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const hotelRoomSchema = new Schema<IHotelRoom>(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["standard", "deluxe", "suite", "family"],
    },
    price: { type: Number, required: true },
    maxGuests: { type: Number, required: true, default: 2 },
    totalRooms: { type: Number, default: 1, min: 0 },
    amenities: [{ type: String }],
    images: [{ type: String }],
    available: { type: Boolean, default: true },
  },
  { _id: false }
);

const hotelImageSchema = new Schema(
  {
    src: { type: String, required: true },
    alt: { type: String, required: true },
    caption: { type: String },
  },
  { _id: false }
);

const hotelSchema = new Schema<IHotel>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    nameVi: { type: String, required: true },
    destinationSlug: { type: String },
    provinceSlug: { type: String, required: true, index: true },
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    stars: { type: Number, required: true, min: 1, max: 5 },
    description: { type: String, required: true },
    longDescription: { type: String, required: true },
    images: [hotelImageSchema],
    priceRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    amenities: [{ type: String }],
    rooms: [hotelRoomSchema],
    contact: {
      phone: { type: String },
      email: { type: String },
      website: { type: String },
    },
    checkInTime: { type: String },
    checkOutTime: { type: String },
    policies: { type: String },
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

hotelSchema.index({ provinceSlug: 1, stars: 1 });

export const Hotel = mongoose.model<IHotel>("Hotel", hotelSchema);
