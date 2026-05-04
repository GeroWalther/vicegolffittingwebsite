import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  checkAdminPassword,
  createAdminCookie,
} from "@/lib/auth";

export async function POST(req: Request) {
  let body: { password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad body" }, { status: 400 });
  }
  const password = typeof body.password === "string" ? body.password : "";
  if (!checkAdminPassword(password)) {
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 200));
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }
  const token = await createAdminCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);
  return res;
}
