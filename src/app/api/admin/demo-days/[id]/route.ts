import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { DemoDay } from "@/lib/models/demoday";
import { isAdmin } from "@/lib/auth";

const Patch = z
  .object({
    title: z.string().min(1).optional(),
    venue: z.string().min(1).optional(),
    address: z.string().optional(),
    description: z.string().optional(),
    startsAt: z.string().datetime().optional(),
    endsAt: z.string().datetime().optional(),
    published: z.boolean().optional(),
  })
  .strict();

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const { id } = await params;

  let body;
  try {
    body = Patch.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "bad body" }, { status: 400 });
  }

  await connectDB();
  const update: Record<string, unknown> = { ...body };
  if (body.startsAt) update.startsAt = new Date(body.startsAt);
  if (body.endsAt) update.endsAt = new Date(body.endsAt);

  await DemoDay.updateOne({ _id: id }, { $set: update });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const { id } = await params;
  await connectDB();
  await DemoDay.deleteOne({ _id: id });
  return NextResponse.json({ ok: true });
}
