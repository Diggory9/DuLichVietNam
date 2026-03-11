import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  id: string;
  destinationSlug: string;
  targetType: "destination" | "hotel" | "tour";
  targetSlug: string;
  userId?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  rating: number;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    destinationSlug: { type: String },
    targetType: {
      type: String,
      enum: ["destination", "hotel", "tour"],
      default: "destination",
    },
    targetSlug: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
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

// Pre-save hook: sync targetSlug with destinationSlug for backward compat
reviewSchema.pre("save", function (next) {
  if (!this.targetSlug && this.destinationSlug) {
    this.targetSlug = this.destinationSlug;
  }
  if (!this.destinationSlug && this.targetSlug && this.targetType === "destination") {
    this.destinationSlug = this.targetSlug;
  }
  if (!this.targetType) {
    this.targetType = "destination";
  }
  next();
});

reviewSchema.index({ targetType: 1, targetSlug: 1, email: 1 }, { unique: true });
reviewSchema.index({ targetType: 1, targetSlug: 1, createdAt: -1 });
// Keep old indexes for backward compat during migration
reviewSchema.index({ destinationSlug: 1, email: 1 });
reviewSchema.index({ destinationSlug: 1, createdAt: -1 });

export const Review = mongoose.model<IReview>("Review", reviewSchema);
