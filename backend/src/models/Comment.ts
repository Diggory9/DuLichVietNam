import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
  id: string;
  postSlug: string;
  name: string;
  email: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    postSlug: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
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

commentSchema.index({ postSlug: 1, createdAt: -1 });

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
