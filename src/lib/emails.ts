import { getResend, FROM_EMAIL, OWNER_EMAIL } from "./resend";
import { buildBookingIcs } from "./ics";
import { BUSINESS } from "./constants";
import type { BookingDoc } from "./models/booking";

export async function sendBookingConfirmation(booking: BookingDoc) {
  const ics = buildBookingIcs({
    bookingId: String(booking._id),
    startsAt: booking.startsAt,
    endsAt: booking.endsAt,
    customerName: booking.name,
    customerEmail: booking.email,
    notes: booking.notes ?? undefined,
  });

  const dateFmt = new Intl.DateTimeFormat(booking.locale ?? "en", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  });
  const when = dateFmt.format(booking.startsAt);

  const html = `
    <div style="font-family: ui-sans-serif, system-ui; background:#0a0a0a; color:#fafafa; padding:40px 24px; max-width:560px; margin:0 auto;">
      <p style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#9ca3af; margin:0 0 8px;">Vice Fitting Mallorca</p>
      <h1 style="font-size:32px; margin:0 0 24px; line-height:1.05;">You're booked.</h1>
      <p style="font-size:16px; line-height:1.6; color:#d4d4d4; margin:0 0 24px;">
        Hi ${escapeHtml(booking.name)}, your Vice Golf fitting is confirmed.
      </p>
      <table style="width:100%; border:1px solid #262626; border-radius:4px; padding:20px; margin:0 0 24px;">
        <tr><td style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#9ca3af; padding-bottom:6px;">When</td></tr>
        <tr><td style="font-size:18px; font-weight:600; padding-bottom:18px;">${escapeHtml(when)} (Mallorca time)</td></tr>
        <tr><td style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#9ca3af; padding-bottom:6px;">Where</td></tr>
        <tr><td style="font-size:18px; font-weight:600; padding-bottom:18px;">${escapeHtml(BUSINESS.location)}</td></tr>
        <tr><td style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#9ca3af; padding-bottom:6px;">Duration</td></tr>
        <tr><td style="font-size:18px; font-weight:600;">${BUSINESS.fittingDurationMinutes} minutes</td></tr>
      </table>
      <p style="font-size:14px; line-height:1.6; color:#d4d4d4;">
        The calendar invite is attached — open it on your phone or Mac and it'll add the session plus reminders. Need to reschedule? Just reply or message me on WhatsApp <a href="https://wa.me/${BUSINESS.whatsappNumber.replace("+", "")}" style="color:#C9FF3D;">${BUSINESS.whatsappDisplay}</a>.
      </p>
      <p style="font-size:14px; line-height:1.6; color:#d4d4d4; margin-top:24px;">See you on the range.</p>
      <p style="font-size:14px; color:#9ca3af; margin-top:8px;">— ${BUSINESS.fitter}</p>
    </div>
  `;

  const text = `Your Vice Golf fitting is confirmed.

When: ${when} (Mallorca time)
Where: ${BUSINESS.location}
Duration: ${BUSINESS.fittingDurationMinutes} minutes

The calendar invite is attached. Need to reschedule? WhatsApp ${BUSINESS.whatsappDisplay}.

— ${BUSINESS.fitter}`;

  const attachment = {
    filename: "vice-fitting.ics",
    content: Buffer.from(ics).toString("base64"),
    contentType: "text/calendar; charset=utf-8; method=REQUEST",
  };

  const resend = getResend();

  await resend.emails.send({
    from: FROM_EMAIL,
    to: booking.email,
    subject: `Vice Fitting confirmed — ${when}`,
    html,
    text,
    attachments: [attachment],
  });

  await resend.emails.send({
    from: FROM_EMAIL,
    to: OWNER_EMAIL,
    subject: `[Booking] ${booking.name} — ${when}`,
    text: `New booking:

Name: ${booking.name}
Email: ${booking.email}
Phone: ${booking.phone || "—"}
When: ${when}
Notes: ${booking.notes || "—"}
Amount: €${(booking.amountCents / 100).toFixed(2)}
Booking ID: ${booking._id}`,
    attachments: [attachment],
  });
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c] as string));
}
