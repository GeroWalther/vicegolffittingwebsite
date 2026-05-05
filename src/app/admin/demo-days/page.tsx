import { AdminNav } from "@/components/admin/admin-nav";
import { DemoDaysAdmin } from "@/components/admin/demo-days-admin";
import { connectDB } from "@/lib/db";
import { DemoDay } from "@/lib/models/demoday";

export const dynamic = "force-dynamic";

async function getAll() {
  try {
    await connectDB();
    const items = await DemoDay.find({}).sort({ startsAt: -1 }).lean();
    return items.map((d) => ({
      id: String(d._id),
      title: d.title,
      venue: d.venue,
      address: d.address ?? "",
      description: d.description ?? "",
      startsAt: d.startsAt.toISOString(),
      endsAt: d.endsAt.toISOString(),
      slotMinutes: d.slotMinutes ?? 30,
      published: !!d.published,
    }));
  } catch (e) {
    console.error("[admin/demo-days]", e);
    return [];
  }
}

export default async function AdminDemoDaysPage() {
  const initial = await getAll();
  return (
    <>
      <AdminNav />
      <main className="container-page py-10">
        <h1 className="display text-3xl mb-6">Demo Days</h1>
        <DemoDaysAdmin initial={initial} />
      </main>
    </>
  );
}
