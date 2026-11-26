"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    let response: Response;
    try {
      response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
      });
    } catch {
      setPending(false);
      setError("The desk could not be reached. Refresh the page and try again.");
      return;
    }
    const data = await response.json().catch(() => ({ error: "Could not sign in." }));
    setPending(false);
    if (!response.ok) {
      setError(data.error || "Could not sign in.");
      return;
    }
    const next = search.get("next");
    router.push(next && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
    router.refresh();
  }

  const field = "mt-2 w-full border border-line bg-white px-3 py-3 text-sm outline-none focus:border-slatebrand";

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <label className="text-sm">
        Email
        <input name="email" type="email" autoComplete="username" required placeholder="admin@gmial.com" className={field} />
        <span className="mt-2 block font-mono text-xs text-mute">admin@gmial.com</span>
      </label>
      <div className="text-sm">
        <label htmlFor="desk-password">Password</label>
        <div className="relative mt-2">
          <input
            id="desk-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className="w-full border border-line bg-white px-3 py-3 pr-11 text-sm outline-none focus:border-slatebrand"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-mute"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((value) => !value)}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>
      {error ? (
        <p className="text-sm text-[#8C3A3A]" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className="bg-gold px-5 py-3 text-sm font-medium text-slatedeep disabled:opacity-60">
        {pending ? "Signing in" : "Enter the desk"}
      </button>
    </form>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-4.4" />
      <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a18.2 18.2 0 0 1-3.2 4.2" />
      <path d="M6.1 6.1C3.8 7.8 2 12 2 12a18.6 18.6 0 0 0 6.2 5.8" />
    </svg>
  );
}
