import mongoose, { Schema, Document, Types } from "mongoose";

export interface IItineraryDay {
  dayNumber: number;
  destinationSlugs: string[];
  notes?: string;
  accommodationCost?: number;
  transportCost?: number;
  mealCost?: number;
  otherCost?: number;
}

export interface IItinerary extends Document {
  userId: Types.ObjectId;
  title: string;
  slug: string;
  description?: string;
  days: IItineraryDay[];
  isPublic: boolean;
  totalBudget?: number;
  createdAt: Date;
  updatedAt: Date;
}

const itineraryDaySchema = new Schema<IItineraryDay>(
  {
    dayNumber: { type: Number, required: true },
    destinationSlugs: [{ type: String }],
    notes: { type: String },
    accommodationCost: { type: Number },
    transportCost: { type: Number },
    mealCost: { type: Number },
    otherCost: { type: Number },
  },
  { _id: false }
);

const itinerarySchema = new Schema<IItinerary>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    days: [itineraryDaySchema],
    isPublic: { type: Boolean, default: false },
    totalBudget: { type: Number },
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

export const Itinerary = mongoose.model<IItinerary>("Itinerary", itinerarySchema);
