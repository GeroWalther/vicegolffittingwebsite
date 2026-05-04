"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type DemoDay = {
  id: string;
  title: string;
  venue: string;
  address: string;
  description: string;
  startsAt: string;
  endsAt: string;
  published: boolean;
};

const EMPTY_DRAFT = {
  title: "",
  venue: "",
  address: "",
  description: "",
  startsAt: "",
  endsAt: "",
  published: true,
};

type Draft = typeof EMPTY_DRAFT;

export function DemoDaysAdmin({ initial }: { initial: DemoDay[] }) {
  const [items, setItems] = useState<DemoDay[]>(initial);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [pending, startTransition] = useTransition();

  function openNew() {
    const start = new Date();
    start.setDate(start.getDate() + 7);
    start.setHours(11, 0, 0, 0);
    const end = new Date(start);
    end.setHours(16, 0, 0, 0);
    setDraft({
      ...EMPTY_DRAFT,
      startsAt: toLocalInput(start),
      endsAt: toLocalInput(end),
    });
  }

  function save() {
    if (!draft) return;
    startTransition(async () => {
      const body = {
        ...draft,
        startsAt: new Date(draft.startsAt).toISOString(),
        endsAt: new Date(draft.endsAt).toISOString(),
      };
      const res = await fetch("/api/admin/demo-days", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        toast.error("Failed to save");
        return;
      }
      const created: DemoDay = await res.json();
      setItems((prev) =>
        [...prev, created].sort(
          (a, b) => +new Date(b.startsAt) - +new Date(a.startsAt),
        ),
      );
      setDraft(null);
      toast.success("Demo day added");
    });
  }

  function remove(id: string) {
    if (!confirm("Delete this demo day?")) return;
    startTransition(async () => {
      const res = await fetch(`/api/admin/demo-days/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Failed to delete");
        return;
      }
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Removed");
    });
  }

  function togglePublish(item: DemoDay) {
    startTransition(async () => {
      const res = await fetch(`/api/admin/demo-days/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !item.published }),
      });
      if (!res.ok) {
        toast.error("Failed to update");
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, published: !i.published } : i,
        ),
      );
    });
  }

  return (
    <div>
      <div className="mb-6">
        {!draft ? (
          <Button onClick={openNew} size="lg" className="uppercase tracking-wider">
            <Plus className="size-4" /> New demo day
          </Button>
        ) : (
          <div className="rounded-md border border-volt/50 bg-card p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Title">
                <Input
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                />
              </Field>
              <Field label="Venue">
                <Input
                  value={draft.venue}
                  onChange={(e) => setDraft({ ...draft, venue: e.target.value })}
                />
              </Field>
              <Field label="Address">
                <Input
                  value={draft.address}
                  onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                />
              </Field>
              <div />
              <Field label="Starts">
                <Input
                  type="datetime-local"
                  value={draft.startsAt}
                  onChange={(e) => setDraft({ ...draft, startsAt: e.target.value })}
                />
              </Field>
              <Field label="Ends">
                <Input
                  type="datetime-local"
                  value={draft.endsAt}
                  onChange={(e) => setDraft({ ...draft, endsAt: e.target.value })}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Description">
                  <Textarea
                    rows={3}
                    value={draft.description}
                    onChange={(e) =>
                      setDraft({ ...draft, description: e.target.value })
                    }
                  />
                </Field>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft.published}
                  onChange={(e) =>
                    setDraft({ ...draft, published: e.target.checked })
                  }
                  className="size-4 accent-[--volt]"
                />
                Publish immediately
              </label>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={save}
                disabled={pending || !draft.title || !draft.venue || !draft.startsAt || !draft.endsAt}
                className="uppercase tracking-wider"
              >
                {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                Save
              </Button>
              <Button variant="outline" onClick={() => setDraft(null)}>
                <X className="size-4" /> Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No demo days yet.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((d) => (
            <div
              key={d.id}
              className="rounded-md border border-border bg-card p-5 flex items-start justify-between gap-4"
            >
              <div className="flex-1">
                <p className="inline-block bg-volt text-volt-foreground px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em]">
                  {new Date(d.startsAt).toLocaleString("en-GB", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <h3 className="mt-1 text-lg font-semibold">{d.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {d.venue}{d.address ? ` · ${d.address}` : ""}
                </p>
                {d.description && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {d.description}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 items-end">
                <button
                  onClick={() => togglePublish(d)}
                  className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded border ${d.published ? "border-volt/50 text-volt" : "border-border text-muted-foreground"}`}
                >
                  {d.published ? "Published" : "Draft"}
                </button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => remove(d.id)}
                  disabled={pending}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="eyebrow">{label}</Label>
      {children}
    </div>
  );
}

function toLocalInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
