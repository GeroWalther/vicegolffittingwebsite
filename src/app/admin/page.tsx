import { Badge } from "@/components/ui/badge";
import { AdminNav } from "@/components/admin/admin-nav";
import { connectDB } from "@/lib/db";
import { Booking } from "@/lib/models/booking";
import { BUSINESS } from "@/lib/constants";

export const dynamic = "force-dynamic";

async function getBookings() {
  try {
    await connectDB();
    const items = await Booking.find({})
      .sort({ startsAt: -1 })
      .limit(200)
      .lean();
    return items;
  } catch (e) {
    console.error("[admin/bookings]", e);
    return [];
  }
}

export default async function AdminBookingsPage() {
  const bookings = await getBookings();
  const upcoming = bookings.filter(
    (b) => b.status !== "cancelled" && b.startsAt.getTime() >= Date.now(),
  );
  const past = bookings.filter(
    (b) => b.status !== "cancelled" && b.startsAt.getTime() < Date.now(),
  );

  const dateFmt = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  });

  const totalRevenueCents = bookings
    .filter((b) => b.status === "paid")
    .reduce((sum, b) => sum + b.amountCents, 0);

  return (
    <>
      <AdminNav />
      <main className="container-page py-10">
        <div className="grid sm:grid-cols-3 gap-3 mb-10">
          <Stat label="Upcoming" value={String(upcoming.length)} />
          <Stat
            label="Paid total"
            value={`€${(totalRevenueCents / 100).toFixed(0)}`}
          />
          <Stat label="All bookings" value={String(bookings.length)} />
        </div>

        <h1 className="display text-3xl mb-6">Upcoming</h1>
        <BookingsTable bookings={upcoming} dateFmt={dateFmt} />

        <h2 className="display text-2xl mt-16 mb-6">Past</h2>
        <BookingsTable bookings={past} dateFmt={dateFmt} muted />
      </main>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-5">
      <p className="eyebrow">{label}</p>
      <p className="mt-2 display text-3xl">{value}</p>
    </div>
  );
}

type B = Awaited<ReturnType<typeof getBookings>>[number];

function BookingsTable({
  bookings,
  dateFmt,
  muted,
}: {
  bookings: B[];
  dateFmt: Intl.DateTimeFormat;
  muted?: boolean;
}) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        Nothing here.
      </div>
    );
  }
  return (
    <div className={muted ? "opacity-60" : ""}>
      <div className="rounded-md border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left">
            <tr className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={String(b._id)} className="border-t border-border/60 align-top">
                <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">
                  {dateFmt.format(b.startsAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold">{b.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {b.locale?.toUpperCase()}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs space-y-0.5">
                  <div>{b.email}</div>
                  {b.phone && <div className="text-muted-foreground">{b.phone}</div>}
                </td>
                <td className="px-4 py-3 max-w-xs">
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {b.notes || "—"}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={b.status} />
                </td>
                <td className="px-4 py-3 text-right font-mono">
                  €{(b.amountCents / 100).toFixed(0)}
                  <div className="text-[10px] text-muted-foreground">
                    {BUSINESS.fittingDurationMinutes}m
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variant: Record<string, string> = {
    paid: "bg-volt/20 text-volt border-volt/40",
    pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    cancelled: "bg-muted text-muted-foreground border-border",
    refunded: "bg-destructive/15 text-destructive border-destructive/30",
  };
  return (
    <Badge
      variant="outline"
      className={`${variant[status] ?? variant.pending} font-mono text-[10px] uppercase tracking-wider`}
    >
      {status}
    </Badge>
  );
}
