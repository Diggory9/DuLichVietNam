import mongoose, { Document, Schema } from "mongoose";

export interface IRoomInventory extends Document {
  hotelSlug: string;
  roomName: string;
  date: Date;
  totalRooms: number;
  bookedRooms: number;
}

const roomInventorySchema = new Schema<IRoomInventory>(
  {
    hotelSlug: { type: String, required: true },
    roomName: { type: String, required: true },
    date: { type: Date, required: true },
    totalRooms: { type: Number, required: true, default: 1, min: 0 },
    bookedRooms: { type: Number, default: 0, min: 0 },
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

roomInventorySchema.index({ hotelSlug: 1, roomName: 1, date: 1 }, { unique: true });
roomInventorySchema.index({ hotelSlug: 1, date: 1 });

export const RoomInventory = mongoose.model<IRoomInventory>("RoomInventory", roomInventorySchema);
