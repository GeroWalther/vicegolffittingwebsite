"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/admin", label: "Bookings" },
  { href: "/admin/demo-days", label: "Demo Days" },
];

export function AdminNav() {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <header className="border-b border-border bg-background sticky top-0 z-30">
      <div className="container-page flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="block size-2 rounded-full bg-volt" />
            <span className="font-mono text-xs uppercase tracking-[0.22em]">
              Admin
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {ITEMS.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-1.5 text-sm font-mono uppercase tracking-wider rounded-md transition",
                    active
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md border border-border hover:bg-muted"
        >
          <LogOut className="size-3.5" /> Logout
        </button>
      </div>
    </header>
  );
}
