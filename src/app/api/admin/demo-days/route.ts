import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { DemoDay } from "@/lib/models/demoday";
import { isAdmin } from "@/lib/auth";

const Body = z.object({
  title: z.string().min(1).max(200),
  venue: z.string().min(1).max(200),
  address: z.string().max(400).optional().default(""),
  description: z.string().max(2000).optional().default(""),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  slotMinutes: z.number().int().min(15).max(240).optional().default(30),
  published: z.boolean().optional().default(true),
});

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauth" }, { status: 401 });
  }

  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch (e) {
    console.error("[admin/demo-days] bad body:", e);
    const issues =
      e instanceof z.ZodError ? e.issues.map((i) => i.message) : undefined;
    return NextResponse.json(
      { error: "bad body", issues },
      { status: 400 },
    );
  }

  try {
    await connectDB();

    const startsAt = new Date(parsed.startsAt);
    const endsAt = new Date(parsed.endsAt);
    if (endsAt <= startsAt) {
      return NextResponse.json(
        { error: "endsAt must be after startsAt" },
        { status: 400 },
      );
    }

    const created = await DemoDay.create({
      title: parsed.title,
      venue: parsed.venue,
      address: parsed.address,
      description: parsed.description,
      startsAt,
      endsAt,
      slotMinutes: parsed.slotMinutes,
      published: parsed.published,
    });

    return NextResponse.json({
      id: String(created._id),
      title: created.title,
      venue: created.venue,
      address: created.address ?? "",
      description: created.description ?? "",
      startsAt: created.startsAt.toISOString(),
      endsAt: created.endsAt.toISOString(),
      slotMinutes: created.slotMinutes ?? 30,
      published: !!created.published,
    });
  } catch (e) {
    console.error("[admin/demo-days POST] failed:", e);
    return NextResponse.json(
      {
        error: "server error",
        message: e instanceof Error ? e.message : String(e),
      },
      { status: 500 },
    );
  }
}
