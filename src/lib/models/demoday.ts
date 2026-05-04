import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const DemoDaySchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    description: { type: String, trim: true },
    startsAt: { type: Date, required: true, index: true },
    endsAt: { type: Date, required: true },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export type DemoDayDoc = InferSchemaType<typeof DemoDaySchema> & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

export const DemoDay: Model<DemoDayDoc> =
  (models.DemoDay as Model<DemoDayDoc>) ||
  model<DemoDayDoc>("DemoDay", DemoDaySchema);
