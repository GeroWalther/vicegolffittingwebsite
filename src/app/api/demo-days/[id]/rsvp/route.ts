import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { DemoDay } from "@/lib/models/demoday";
import { DemoDayRsvp } from "@/lib/models/demoday-rsvp";
import { sendDemoDayRsvpConfirmation } from "@/lib/emails";

const Body = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional().default(""),
  handicap: z.string().max(16).optional().default(""),
  slotIso: z.string().datetime(),
  locale: z.enum(["en", "de", "es"]).default("en"),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "bad body" }, { status: 400 });
  }

  await connectDB();
  const demo = await DemoDay.findById(id);
  if (!demo || !demo.published) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const slotStartsAt = new Date(parsed.slotIso);
  const slotMinutes = demo.slotMinutes ?? 30;
  const slotEndsAt = new Date(slotStartsAt.getTime() + slotMinutes * 60_000);

  // Validate slot lies within demo day window.
  if (
    slotStartsAt < demo.startsAt ||
    slotEndsAt > demo.endsAt ||
    slotStartsAt.getTime() < Date.now()
  ) {
    return NextResponse.json({ error: "invalid slot" }, { status: 400 });
  }

  let rsvp;
  try {
    rsvp = await DemoDayRsvp.create({
      demoDayId: demo._id,
      name: parsed.name.trim(),
      email: parsed.email.trim().toLowerCase(),
      phone: parsed.phone.trim(),
      handicap: parsed.handicap.trim(),
      slotStartsAt,
      slotEndsAt,
      locale: parsed.locale,
      status: "confirmed",
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

  // Fire-and-forget the confirmation email — don't block the user.
  try {
    await sendDemoDayRsvpConfirmation(rsvp, demo);
    rsvp.confirmationSentAt = new Date();
    await rsvp.save();
  } catch (e) {
    console.error("[demo-day rsvp] email send failed:", e);
    // Still return success — the RSVP itself is created.
  }

  return NextResponse.json({
    ok: true,
    id: String(rsvp._id),
  });
}
