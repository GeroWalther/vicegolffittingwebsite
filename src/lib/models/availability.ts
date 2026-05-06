import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const AvailabilitySchema = new Schema(
  {
    // UTC midnight of the open day. We key by Madrid-local calendar date
    // (stored as `YYYY-MM-DDT00:00:00.000Z`) so day boundaries are stable.
    date: { type: Date, required: true, unique: true, index: true },
    // "HH:MM" 24h strings in Madrid local time, e.g. ["09:00", "10:30"].
    slots: { type: [String], default: [] },
  },
  { timestamps: true },
);

export type AvailabilityDoc = InferSchemaType<typeof AvailabilitySchema> & {
  _id: string;
};

export const Availability: Model<AvailabilityDoc> =
  (models.Availability as Model<AvailabilityDoc>) ||
  model<AvailabilityDoc>("Availability", AvailabilitySchema);
