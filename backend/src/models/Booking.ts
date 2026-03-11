import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  id: string;
  bookingCode: string;
  userId: mongoose.Types.ObjectId;
  type: "hotel" | "tour";
  hotelSlug?: string;
  roomName?: string;
  tourSlug?: string;
  checkIn?: Date;
  checkOut?: Date;
  tourDate?: Date;
  guests: number;
  contactInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  notes?: string;
  totalPrice: number;
  paymentStatus: "unpaid" | "pending" | "paid" | "refunded";
  paymentMethod?: "vnpay" | "bank_transfer" | "cash";
  paymentTransactionId?: string;
  paymentDate?: Date;
  status: "pending" | "confirmed" | "cancelled";
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

function generateBookingCode(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BK-${y}${m}${d}-${rand}`;
}

const bookingSchema = new Schema<IBooking>(
  {
    bookingCode: { type: String, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true, enum: ["hotel", "tour"] },
    hotelSlug: { type: String },
    roomName: { type: String },
    tourSlug: { type: String },
    checkIn: { type: Date },
    checkOut: { type: Date },
    tourDate: { type: Date },
    guests: { type: Number, required: true, min: 1 },
    contactInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    notes: { type: String },
    totalPrice: { type: Number, required: true },
    paymentStatus: { type: String, default: "unpaid", enum: ["unpaid", "pending", "paid", "refunded"] },
    paymentMethod: { type: String, enum: ["vnpay", "bank_transfer", "cash"] },
    paymentTransactionId: { type: String },
    paymentDate: { type: Date },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "confirmed", "cancelled"],
    },
    cancellationReason: { type: String },
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

bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });

bookingSchema.pre("save", function (next) {
  if (!this.bookingCode) {
    this.bookingCode = generateBookingCode();
  }
  next();
});

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
