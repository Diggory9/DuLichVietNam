import mongoose, { Schema, Document } from "mongoose";

export interface ISubscriber extends Document {
  email: string;
  isActive: boolean;
  subscribedAt: Date;
  unsubscribedAt?: Date;
}

const subscriberSchema = new Schema<ISubscriber>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    isActive: { type: Boolean, default: true },
    subscribedAt: { type: Date, default: Date.now },
    unsubscribedAt: { type: Date },
  },
  {
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

export const Subscriber = mongoose.model<ISubscriber>("Subscriber", subscriberSchema);
