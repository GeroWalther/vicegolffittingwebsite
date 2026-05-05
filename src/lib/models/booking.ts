import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const BookingSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    handicap: { type: String, trim: true, maxlength: 16 },
    notes: { type: String, trim: true },
    startsAt: { type: Date, required: true, index: true },
    endsAt: { type: Date, required: true },
    locale: { type: String, enum: ["en", "de", "es"], default: "en" },
    amountCents: { type: Number, required: true },
    currency: { type: String, default: "eur" },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled", "refunded"],
      default: "pending",
      index: true,
    },
    stripeSessionId: { type: String, index: true },
    stripePaymentIntentId: { type: String },
    confirmationSentAt: { type: Date },
  },
  { timestamps: true },
);

BookingSchema.index(
  { startsAt: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ["pending", "paid"] } },
  },
);

export type BookingDoc = InferSchemaType<typeof BookingSchema> & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

export const Booking: Model<BookingDoc> =
  (models.Booking as Model<BookingDoc>) ||
  model<BookingDoc>("Booking", BookingSchema);
