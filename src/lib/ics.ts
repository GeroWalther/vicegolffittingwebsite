import { createEvent, type EventAttributes } from "ics";
import { BUSINESS } from "./constants";

export type IcsBookingInput = {
  bookingId: string;
  startsAt: Date;
  endsAt: Date;
  customerName: string;
  customerEmail: string;
  notes?: string;
};

export type IcsDemoDayRsvpInput = {
  rsvpId: string;
  startsAt: Date;
  endsAt: Date;
  title: string;
  venue: string;
  address?: string;
  customerName: string;
  customerEmail: string;
};

function toArray(d: Date): [number, number, number, number, number] {
  return [
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
  ];
}

export function buildBookingIcs(input: IcsBookingInput): string {
  const event: EventAttributes = {
    start: toArray(input.startsAt),
    startInputType: "utc",
    end: toArray(input.endsAt),
    endInputType: "utc",
    title: `Vice Golf Fitting — ${input.customerName}`,
    description: [
      `Vice Golf club fitting with ${BUSINESS.fitter}.`,
      input.notes ? `\nNotes: ${input.notes}` : "",
      `\nQuestions? WhatsApp ${BUSINESS.whatsappDisplay}`,
    ]
      .filter(Boolean)
      .join(""),
    location: BUSINESS.location,
    organizer: { name: BUSINESS.fitter, email: BUSINESS.email },
    attendees: [
      { name: input.customerName, email: input.customerEmail, rsvp: true },
    ],
    uid: `${input.bookingId}@vicefitting`,
    alarms: [
      { action: "display", description: "Vice Golf Fitting tomorrow", trigger: { hours: 24, before: true } },
      { action: "display", description: "Vice Golf Fitting in 1 hour", trigger: { hours: 1, before: true } },
    ],
    status: "CONFIRMED",
    busyStatus: "BUSY",
    productId: "vicefitting/ics",
  };

  const { error, value } = createEvent(event);
  if (error || !value) throw error ?? new Error("Failed to build ICS");
  return value;
}

export function buildDemoDayRsvpIcs(input: IcsDemoDayRsvpInput): string {
  const event: EventAttributes = {
    start: toArray(input.startsAt),
    startInputType: "utc",
    end: toArray(input.endsAt),
    endInputType: "utc",
    title: `Vice Demo Day — ${input.title}`,
    description: [
      `Vice Golf demo day slot with ${BUSINESS.fitter}.`,
      `\nQuestions? WhatsApp ${BUSINESS.whatsappDisplay}`,
    ].join(""),
    location: input.address ? `${input.venue}, ${input.address}` : input.venue,
    organizer: { name: BUSINESS.fitter, email: BUSINESS.email },
    attendees: [
      { name: input.customerName, email: input.customerEmail, rsvp: true },
    ],
    uid: `demoday-${input.rsvpId}@vicefitting`,
    alarms: [
      { action: "display", description: "Vice Demo Day tomorrow", trigger: { hours: 24, before: true } },
      { action: "display", description: "Vice Demo Day in 1 hour", trigger: { hours: 1, before: true } },
    ],
    status: "CONFIRMED",
    busyStatus: "BUSY",
    productId: "vicefitting/ics",
  };

  const { error, value } = createEvent(event);
  if (error || !value) throw error ?? new Error("Failed to build demo-day ICS");
  return value;
}
