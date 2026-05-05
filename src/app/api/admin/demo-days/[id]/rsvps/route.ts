import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { DemoDayRsvp } from "@/lib/models/demoday-rsvp";
import { isAdmin } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauth" }, { status: 401 });
  }
  const { id } = await params;

  await connectDB();
  const rsvps = await DemoDayRsvp.find({ demoDayId: id })
    .sort({ slotStartsAt: 1 })
    .lean();

  return NextResponse.json({
    rsvps: rsvps.map((r) => ({
      id: String(r._id),
      name: r.name,
      email: r.email,
      phone: r.phone,
      handicap: r.handicap ?? "",
      slotStartsAt: r.slotStartsAt.toISOString(),
      slotEndsAt: r.slotEndsAt.toISOString(),
      status: r.status,
      locale: r.locale,
      createdAt: r.createdAt.toISOString(),
    })),
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauth" }, { status: 401 });
  }
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const rsvpId = searchParams.get("rsvpId");
  if (!rsvpId) {
    return NextResponse.json({ error: "rsvpId required" }, { status: 400 });
  }

  await connectDB();
  await DemoDayRsvp.updateOne(
    { _id: rsvpId, demoDayId: id },
    { $set: { status: "cancelled" } },
  );

  return NextResponse.json({ ok: true });
}
