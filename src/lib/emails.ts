import { getResend, FROM_EMAIL, OWNER_EMAIL } from "./resend";
import { buildBookingIcs, buildDemoDayRsvpIcs } from "./ics";
import { BUSINESS } from "./constants";
import type { BookingDoc } from "./models/booking";
import type { DemoDayRsvpDoc } from "./models/demoday-rsvp";
import type { DemoDayDoc } from "./models/demoday";

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
    <div style="font-family: ui-sans-serif, system-ui; background:#ffffff; color:#0a0a0a; padding:40px 24px; max-width:560px; margin:0 auto;">
      <p style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#6b7280; margin:0 0 8px;">Vice Fitting Mallorca</p>
      <h1 style="font-size:32px; margin:0 0 24px; line-height:1.05; color:#0a0a0a;">You're booked.</h1>
      <p style="font-size:16px; line-height:1.6; color:#374151; margin:0 0 24px;">
        Hi ${escapeHtml(booking.name)}, your Vice Golf fitting is confirmed.
      </p>
      <table style="width:100%; border:1px solid #e5e7eb; border-radius:4px; padding:20px; margin:0 0 24px; color:#0a0a0a;">
        <tr><td style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#6b7280; padding-bottom:6px;">When</td></tr>
        <tr><td style="font-size:18px; font-weight:600; color:#0a0a0a; padding-bottom:18px;">${escapeHtml(when)} (Mallorca time)</td></tr>
        <tr><td style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#6b7280; padding-bottom:6px;">Where</td></tr>
        <tr><td style="font-size:18px; font-weight:600; color:#0a0a0a; padding-bottom:18px;">${escapeHtml(BUSINESS.location)}</td></tr>
        <tr><td style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#6b7280; padding-bottom:6px;">Duration</td></tr>
        <tr><td style="font-size:18px; font-weight:600; color:#0a0a0a;">${BUSINESS.fittingDurationMinutes} minutes</td></tr>
      </table>
      <p style="font-size:14px; line-height:1.6; color:#374151;">
        The calendar invite is attached — open it on your phone or Mac and it'll add the session plus reminders. Need to reschedule? Just reply or message me on WhatsApp <a href="https://wa.me/${BUSINESS.whatsappNumber.replace("+", "")}" style="color:#0a0a0a; font-weight:600;">${BUSINESS.whatsappDisplay}</a>.
      </p>
      <p style="font-size:14px; line-height:1.6; color:#374151; margin-top:24px;">See you on the range.</p>
      <p style="font-size:14px; color:#6b7280; margin-top:8px;">— ${BUSINESS.fitter}</p>
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
Handicap: ${booking.handicap || "—"}
When: ${when}
Notes: ${booking.notes || "—"}
Amount: €${(booking.amountCents / 100).toFixed(2)}
Booking ID: ${booking._id}`,
    attachments: [attachment],
  });
}

export async function sendDemoDayRsvpConfirmation(
  rsvp: DemoDayRsvpDoc,
  demoDay: DemoDayDoc,
) {
  const ics = buildDemoDayRsvpIcs({
    rsvpId: String(rsvp._id),
    startsAt: rsvp.slotStartsAt,
    endsAt: rsvp.slotEndsAt,
    title: demoDay.title,
    venue: demoDay.venue,
    address: demoDay.address ?? undefined,
    customerName: rsvp.name,
    customerEmail: rsvp.email,
  });

  const dateFmt = new Intl.DateTimeFormat(rsvp.locale ?? "en", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  });
  const when = dateFmt.format(rsvp.slotStartsAt);

  const html = `
    <div style="font-family: ui-sans-serif, system-ui; background:#fff; color:#0a0a0a; padding:40px 24px; max-width:560px; margin:0 auto;">
      <p style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#6b7280; margin:0 0 8px;">Vice Fitting Mallorca · Demo Day</p>
      <h1 style="font-size:32px; margin:0 0 24px; line-height:1.05;">You're on the list.</h1>
      <p style="font-size:16px; line-height:1.6; color:#374151; margin:0 0 24px;">
        Hi ${escapeHtml(rsvp.name)}, your demo day slot is confirmed — free of charge.
      </p>
      <table style="width:100%; border:1px solid #e5e7eb; border-radius:4px; padding:20px; margin:0 0 24px;">
        <tr><td style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#6b7280; padding-bottom:6px;">Event</td></tr>
        <tr><td style="font-size:18px; font-weight:600; padding-bottom:18px;">${escapeHtml(demoDay.title)}</td></tr>
        <tr><td style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#6b7280; padding-bottom:6px;">When</td></tr>
        <tr><td style="font-size:18px; font-weight:600; padding-bottom:18px;">${escapeHtml(when)} (Mallorca time)</td></tr>
        <tr><td style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#6b7280; padding-bottom:6px;">Where</td></tr>
        <tr><td style="font-size:18px; font-weight:600;">${escapeHtml(demoDay.venue)}${demoDay.address ? `<br><span style="font-size:14px; font-weight:400; color:#6b7280;">${escapeHtml(demoDay.address)}</span>` : ""}</td></tr>
      </table>
      <p style="font-size:14px; line-height:1.6; color:#374151;">
        Calendar invite is attached. Need to cancel? Just reply or message me on WhatsApp <a href="https://wa.me/${BUSINESS.whatsappNumber.replace("+", "")}" style="color:#0a0a0a; font-weight:600;">${BUSINESS.whatsappDisplay}</a>.
      </p>
      <p style="font-size:14px; line-height:1.6; color:#374151; margin-top:24px;">See you on the range.</p>
      <p style="font-size:14px; color:#6b7280; margin-top:8px;">— ${BUSINESS.fitter}</p>
    </div>
  `;

  const text = `Demo day RSVP confirmed.

Event: ${demoDay.title}
When: ${when} (Mallorca time)
Where: ${demoDay.venue}${demoDay.address ? `, ${demoDay.address}` : ""}

Calendar invite is attached. WhatsApp ${BUSINESS.whatsappDisplay} to cancel.

— ${BUSINESS.fitter}`;

  const attachment = {
    filename: "vice-demo-day.ics",
    content: Buffer.from(ics).toString("base64"),
    contentType: "text/calendar; charset=utf-8; method=REQUEST",
  };

  const resend = getResend();

  await resend.emails.send({
    from: FROM_EMAIL,
    to: rsvp.email,
    subject: `Vice Demo Day confirmed — ${when}`,
    html,
    text,
    attachments: [attachment],
  });

  await resend.emails.send({
    from: FROM_EMAIL,
    to: OWNER_EMAIL,
    subject: `[Demo RSVP] ${rsvp.name} — ${demoDay.title} · ${when}`,
    text: `New demo day signup:

Event: ${demoDay.title}
Venue: ${demoDay.venue}${demoDay.address ? `, ${demoDay.address}` : ""}
When: ${when}

Name: ${rsvp.name}
Email: ${rsvp.email}
Phone: ${rsvp.phone || "—"}
Handicap: ${rsvp.handicap || "—"}

RSVP ID: ${rsvp._id}`,
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
