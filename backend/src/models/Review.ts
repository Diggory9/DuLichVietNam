import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  id: string;
  destinationSlug: string;
  name: string;
  email: string;
  rating: number;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    destinationSlug: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    content: { type: String },
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

reviewSchema.index({ destinationSlug: 1, email: 1 }, { unique: true });
reviewSchema.index({ destinationSlug: 1, createdAt: -1 });

export const Review = mongoose.model<IReview>("Review", reviewSchema);
