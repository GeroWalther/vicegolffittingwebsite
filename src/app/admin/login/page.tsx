"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
      });
      if (res.ok) {
        const params = new URLSearchParams(window.location.search);
        const from = params.get("from") || "/admin";
        window.location.href = from;
        return;
      }
      setError("Wrong password");
    });
  }

  return (
    <main className="min-h-screen grid place-items-center px-6 bg-background text-foreground">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-md border border-border bg-card p-8"
      >
        <p className="eyebrow mb-6">/admin</p>
        <h1 className="display text-3xl mb-8">Sign in</h1>
        <div className="space-y-2">
          <Label htmlFor="pwd" className="eyebrow">Password</Label>
          <Input
            id="pwd"
            type="password"
            autoFocus
            required
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          />
        </div>
        {error && (
          <p className="mt-3 text-sm text-destructive">{error}</p>
        )}
        <Button
          type="submit"
          size="lg"
          disabled={pending || !pwd}
          className="mt-6 w-full h-11 uppercase tracking-wider"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : "Enter"}
        </Button>
      </form>
    </main>
  );
}
