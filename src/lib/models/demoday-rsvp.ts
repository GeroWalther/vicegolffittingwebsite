import {
  Schema,
  model,
  models,
  Types,
  type InferSchemaType,
  type Model,
} from "mongoose";

const DemoDayRsvpSchema = new Schema(
  {
    demoDayId: {
      type: Schema.Types.ObjectId,
      ref: "DemoDay",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: "" },
    handicap: { type: String, trim: true, default: "", maxlength: 16 },
    slotStartsAt: { type: Date, required: true },
    slotEndsAt: { type: Date, required: true },
    locale: { type: String, enum: ["en", "de", "es"], default: "en" },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
      index: true,
    },
    confirmationSentAt: { type: Date },
  },
  { timestamps: true },
);

// One confirmed RSVP per (demoDay, slot) — concurrent signups race-safe.
DemoDayRsvpSchema.index(
  { demoDayId: 1, slotStartsAt: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "confirmed" },
  },
);

export type DemoDayRsvpDoc = InferSchemaType<typeof DemoDayRsvpSchema> & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const DemoDayRsvp: Model<DemoDayRsvpDoc> =
  (models.DemoDayRsvp as Model<DemoDayRsvpDoc>) ||
  model<DemoDayRsvpDoc>("DemoDayRsvp", DemoDayRsvpSchema);
