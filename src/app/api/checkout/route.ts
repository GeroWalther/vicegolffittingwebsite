import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Booking } from "@/lib/models/booking";
import { Availability } from "@/lib/models/availability";
import { getStripe } from "@/lib/stripe";
import { BUSINESS, SITE_URL } from "@/lib/constants";
import { slotEnd } from "@/lib/slots";
import { dayKeyToUtcMidnight, venueDateAndTime } from "@/lib/availability-utils";

const Body = z.object({
  startsAt: z.string().datetime(),
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional().default(""),
  handicap: z.string().max(16).optional().default(""),
  notes: z.string().max(2000).optional().default(""),
  locale: z.enum(["en", "de", "es"]).default("en"),
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const startsAt = new Date(parsed.startsAt);
  if (isNaN(startsAt.getTime()) || startsAt.getTime() < Date.now()) {
    return NextResponse.json({ error: "invalid time" }, { status: 400 });
  }
  const endsAt = slotEnd(startsAt);

  await connectDB();

  const { date: venueDate, time: venueTime } = venueDateAndTime(startsAt);
  const dayKey = dayKeyToUtcMidnight(venueDate);
  if (!dayKey) {
    return NextResponse.json({ error: "invalid time" }, { status: 400 });
  }
  const availability = await Availability.findOne({ date: dayKey }).lean();
  if (!availability || !availability.slots.includes(venueTime)) {
    return NextResponse.json(
      { error: "slot not available", code: "SLOT_NOT_AVAILABLE" },
      { status: 400 },
    );
  }

  const conflict = await Booking.findOne({
    startsAt,
    status: { $in: ["pending", "paid"] },
  }).lean();
  if (conflict) {
    return NextResponse.json(
      { error: "slot taken", code: "SLOT_TAKEN" },
      { status: 409 },
    );
  }

  let booking;
  try {
    booking = await Booking.create({
      name: parsed.name.trim(),
      email: parsed.email.trim().toLowerCase(),
      phone: parsed.phone.trim(),
      handicap: parsed.handicap.trim(),
      notes: parsed.notes.trim(),
      startsAt,
      endsAt,
      locale: parsed.locale,
      amountCents: BUSINESS.fittingPriceCents,
      currency: BUSINESS.currency,
      status: "pending",
    });
  } catch (e: unknown) {
    const err = e as { code?: number };
    if (err?.code === 11000) {
      return NextResponse.json(
        { error: "slot taken", code: "SLOT_TAKEN" },
        { status: 409 },
      );
    }
    throw e;
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: booking.email,
    locale: parsed.locale,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: BUSINESS.currency,
          unit_amount: BUSINESS.fittingPriceCents,
          product_data: {
            name: `Vice Golf Fitting · ${BUSINESS.fittingDurationMinutes} min · ${BUSINESS.location}`,
            description: `${startsAt.toUTCString()} — booked under ${booking.name}`,
          },
        },
      },
    ],
    payment_intent_data: {
      // Up to 22 chars total (prefix + suffix combined). This is what shows on
      // the customer's credit-card statement — keeps Vice Fitting bookings
      // identifiable regardless of the account-level business name.
      statement_descriptor_suffix: "VICEFITTING",
      description: `Vice Golf Fitting · ${booking.name} · ${startsAt.toISOString()}`,
    },
    metadata: { bookingId: String(booking._id) },
    success_url: `${SITE_URL}/${parsed.locale}/book/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/${parsed.locale}/book/cancel?session_id={CHECKOUT_SESSION_ID}`,
  });

  await Booking.updateOne(
    { _id: booking._id },
    { $set: { stripeSessionId: session.id } },
  );

  return NextResponse.json({ url: session.url });
}
