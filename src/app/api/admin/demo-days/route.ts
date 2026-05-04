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
  published: z.boolean().optional().default(true),
});

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauth" }, { status: 401 });

  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "bad body" }, { status: 400 });
  }

  await connectDB();
  const created = await DemoDay.create({
    title: parsed.title,
    venue: parsed.venue,
    address: parsed.address,
    description: parsed.description,
    startsAt: new Date(parsed.startsAt),
    endsAt: new Date(parsed.endsAt),
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
    published: !!created.published,
  });
}
