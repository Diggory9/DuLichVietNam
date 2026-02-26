import mongoose, { Schema, Document } from "mongoose";

export interface ISiteConfig extends Document {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    github?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const siteConfigSchema = new Schema<ISiteConfig>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    ogImage: { type: String, default: "" },
    links: {
      github: { type: String },
    },
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

export const SiteConfig = mongoose.model<ISiteConfig>(
  "SiteConfig",
  siteConfigSchema
);
