import { Resend } from "resend";

let _resend: Resend | null = null;

export function getResend(): Resend {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY env var is not set");
  _resend = new Resend(key);
  return _resend;
}

export const FROM_EMAIL =
  process.env.RESEND_FROM ?? "Vice Fitting <bookings@example.com>";
export const OWNER_EMAIL =
  process.env.OWNER_EMAIL ?? "gero.walther@gmail.com";
