import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "vf_admin";
const ALG = "HS256";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET env var must be set and at least 32 characters",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createAdminCookie(): Promise<string> {
  return await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecret());
}

export async function verifyAdminCookie(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminCookie(token);
}

export function checkAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  if (password.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < password.length; i++) {
    mismatch |= password.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};
