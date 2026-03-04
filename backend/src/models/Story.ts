import mongoose, { Schema, Document } from "mongoose";

export interface IStoryPhoto {
  src: string;
  caption?: string;
}

export interface IStory extends Document {
  id: string;
  userId: mongoose.Types.ObjectId;
  authorName: string;
  destinationSlug?: string;
  title: string;
  slug: string;
  content: string;
  photos: IStoryPhoto[];
  visitDate?: Date;
  rating?: number;
  status: "pending" | "approved" | "rejected";
  likes: string[];
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const storyPhotoSchema = new Schema<IStoryPhoto>(
  {
    src: { type: String, required: true },
    caption: { type: String },
  },
  { _id: false }
);

const storySchema = new Schema<IStory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    authorName: { type: String, required: true },
    destinationSlug: { type: String, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: { type: String, required: true },
    photos: [storyPhotoSchema],
    visitDate: { type: Date },
    rating: { type: Number, min: 1, max: 5 },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
      index: true,
    },
    likes: [{ type: String }],
    likeCount: { type: Number, default: 0 },
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

storySchema.index({ status: 1, createdAt: -1 });

export const Story = mongoose.model<IStory>("Story", storySchema);
