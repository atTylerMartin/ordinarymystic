"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { Button } from "@/components/button";
import { Stars } from "@/components/stars";
import { getSupabase } from "@/lib/supabase";

type AdminReview = {
  id: string;
  name: string;
  rating: number;
  body: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

const STATUS_STYLES: Record<AdminReview["status"], string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-slate-200 text-slate-600",
};

// Pending first, then newest.
function sortReviews(rows: AdminReview[]): AdminReview[] {
  return [...rows].sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (b.status === "pending" && a.status !== "pending") return 1;
    return a.created_at < b.created_at ? 1 : -1;
  });
}

export function AdminReviews() {
  const supabase = getSupabase();
  const [authChecked, setAuthChecked] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  // Track auth state.
  useEffect(() => {
    if (!supabase) {
      setAuthChecked(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthChecked(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  if (!supabase) {
    return (
      <Shell>
        <p className="text-sm text-slate-600">
          Admin is unavailable — Supabase isn’t configured.
        </p>
      </Shell>
    );
  }

  if (!authChecked) {
    return (
      <Shell>
        <p className="text-sm text-slate-500">Loading…</p>
      </Shell>
    );
  }

  if (!session) {
    return (
      <Shell>
        <LoginForm />
      </Shell>
    );
  }

  const isAdmin = session.user.app_metadata?.role === "admin";
  if (!isAdmin) {
    return (
      <Shell>
        <div className="max-w-sm rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md">
          <p className="text-sm text-slate-700">
            This account doesn’t have admin access.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => supabase.auth.signOut()}
          >
            Sign out
          </Button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <Dashboard
        email={session.user.email ?? ""}
        onSignOut={() => supabase.auth.signOut()}
      />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-3xl py-6">
      <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900">
        Review moderation
      </h1>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function LoginForm() {
  const supabase = getSupabase()!;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setError(error.message);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-sm rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md"
    >
      <p className="text-sm text-slate-600">Sign in to moderate reviews.</p>
      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="admin-email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>
        <div>
          <label htmlFor="admin-password" className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </div>
    </form>
  );
}

function Dashboard({
  email,
  onSignOut,
}: {
  email: string;
  onSignOut: () => void;
}) {
  const supabase = getSupabase()!;
  const [reviews, setReviews] = useState<AdminReview[] | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError("");
    const { data, error } = await supabase
      .from("reviews")
      .select("id, name, rating, body, status, created_at")
      .order("created_at", { ascending: false });
    if (error) {
      setError(error.message);
      return;
    }
    setReviews(sortReviews((data as AdminReview[]) ?? []));
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(id: string, status: AdminReview["status"]) {
    setBusyId(id);
    setError("");
    const { error } = await supabase
      .from("reviews")
      .update({ status })
      .eq("id", id);
    setBusyId(null);
    if (error) {
      setError(error.message);
      return;
    }
    setReviews((prev) =>
      prev ? sortReviews(prev.map((r) => (r.id === id ? { ...r, status } : r))) : prev,
    );
  }

  const pendingCount = reviews?.filter((r) => r.status === "pending").length ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-600">
          Signed in as <span className="font-medium text-slate-800">{email}</span>
          {reviews && (
            <>
              {" · "}
              <span className="font-medium text-amber-700">
                {pendingCount} pending
              </span>
            </>
          )}
        </p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={load}>
            Refresh
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onSignOut}>
            Sign out
          </Button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 space-y-4">
        {reviews === null ? (
          <p className="text-sm text-slate-500">Loading reviews…</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-slate-500">No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-3">
                <Stars rating={r.rating} />
                <span className="text-sm font-medium text-slate-900">{r.name}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[r.status]}`}
                >
                  {r.status}
                </span>
                <span className="ml-auto text-xs text-slate-400">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{r.body}</p>
              <div className="mt-4 flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  disabled={busyId === r.id || r.status === "approved"}
                  onClick={() => setStatus(r.id, "approved")}
                  className="bg-green-600 hover:bg-green-700 focus-visible:ring-green-600"
                >
                  Approve
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busyId === r.id || r.status === "rejected"}
                  onClick={() => setStatus(r.id, "rejected")}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
