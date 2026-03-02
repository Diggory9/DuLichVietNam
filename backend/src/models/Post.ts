import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  published: boolean;
  publishedAt: Date | null;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, default: "" },
    author: { type: String, default: "Admin" },
    category: { type: String, required: true, index: true },
    tags: [{ type: String }],
    published: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
    views: { type: Number, default: 0 },
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

postSchema.index({ published: 1, publishedAt: -1 });
postSchema.index({ category: 1, published: 1 });

export const Post = mongoose.model<IPost>("Post", postSchema);
