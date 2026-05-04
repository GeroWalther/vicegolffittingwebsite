import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { connectDB } from "@/lib/db";
import { Booking } from "@/lib/models/booking";
import { sendBookingConfirmation } from "@/lib/emails";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (e) {
    console.error("[stripe webhook] bad signature", e);
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }

  await connectDB();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;
    if (!bookingId) return NextResponse.json({ ok: true });

    const booking = await Booking.findById(bookingId);
    if (!booking) return NextResponse.json({ ok: true });

    if (booking.status !== "paid") {
      booking.status = "paid";
      booking.stripePaymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : (session.payment_intent?.id ?? undefined);
      await booking.save();

      try {
        await sendBookingConfirmation(booking);
        booking.confirmationSentAt = new Date();
        await booking.save();
      } catch (e) {
        console.error("[stripe webhook] email send failed:", e);
      }
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;
    if (bookingId) {
      await Booking.updateOne(
        { _id: bookingId, status: "pending" },
        { $set: { status: "cancelled" } },
      );
    }
  }

  return NextResponse.json({ received: true });
}
