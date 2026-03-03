import mongoose, { Schema, Document, Types } from "mongoose";

export interface INotification extends Document {
  userId: Types.ObjectId;
  type: "new_post" | "comment_reply" | "review_reply" | "system";
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      required: true,
      enum: ["new_post", "comment_reply", "review_reply", "system"],
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    read: { type: Boolean, default: false },
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

notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>("Notification", notificationSchema);
