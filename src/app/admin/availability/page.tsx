import { AdminNav } from "@/components/admin/admin-nav";
import { AvailabilityAdmin } from "@/components/admin/availability-admin";
import { connectDB } from "@/lib/db";
import { Availability } from "@/lib/models/availability";
import { Booking } from "@/lib/models/booking";
import { DAILY_SLOTS } from "@/lib/constants";
import { venueDateAndTime } from "@/lib/availability-utils";

export const dynamic = "force-dynamic";

async function getInitial() {
  try {
    await connectDB();
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const [availability, bookings] = await Promise.all([
      Availability.find({ date: { $gte: today } })
        .sort({ date: 1 })
        .limit(180)
        .lean(),
      Booking.find({
        status: { $in: ["pending", "paid"] },
        startsAt: { $gte: today },
      })
        .select("startsAt name")
        .sort({ startsAt: 1 })
        .lean(),
    ]);

    const takenByDate = new Map<string, { time: string; name: string }[]>();
    for (const b of bookings) {
      const { date, time } = venueDateAndTime(b.startsAt);
      const arr = takenByDate.get(date) ?? [];
      arr.push({ time, name: b.name });
      takenByDate.set(date, arr);
    }

    return {
      items: availability.map((a) => {
        const dateKey = a.date.toISOString().slice(0, 10);
        return {
          id: String(a._id),
          date: dateKey,
          slots: a.slots,
          taken: (takenByDate.get(dateKey) ?? []).map((b) => b.time),
        };
      }),
      bookingsByDate: Object.fromEntries(takenByDate),
    };
  } catch (e) {
    console.error("[admin/availability]", e);
    return { items: [], bookingsByDate: {} };
  }
}

export default async function AdminAvailabilityPage() {
  const { items, bookingsByDate } = await getInitial();
  return (
    <>
      <AdminNav />
      <main className="container-page py-10">
        <h1 className="display text-3xl mb-2">Availability</h1>
        <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
          Pick a date and tick which time slots you can fit customers in. Days
          you don&apos;t open here are hidden from the public booking calendar.
        </p>
        <AvailabilityAdmin
          initial={items}
          bookingsByDate={bookingsByDate}
          presetSlots={[...DAILY_SLOTS]}
        />
      </main>
    </>
  );
}
