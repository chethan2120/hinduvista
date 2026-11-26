"use client";

import { FormEvent, useState } from "react";

type EnquiryFormProps = {
  destinations: string[];
  initialDestination?: string;
};

type Success = {
  whatsappUrl: string | null;
  notice: string;
};

export function EnquiryForm({ destinations, initialDestination = "" }: EnquiryFormProps) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState<Success | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      fullName: String(form.get("fullName") || ""),
      email: String(form.get("email") || ""),
      mobile: String(form.get("mobile") || ""),
      destination: String(form.get("destination") || ""),
      message: String(form.get("message") || ""),
      company: String(form.get("company") || ""),
    };

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { error?: string; whatsappUrl?: string | null; notice?: string };
      if (!response.ok) {
        setError(data.error || "The enquiry could not be saved.");
        setPending(false);
        return;
      }
      setSuccess({
        whatsappUrl: data.whatsappUrl || null,
        notice: data.notice || "Your enquiry has been saved.",
      });
    } catch {
      setError("The enquiry could not be saved. Please try again.");
      setPending(false);
    }
  }

  if (success) {
    return (
      <div className="border border-line bg-ivory p-6 md:p-8" role="status">
        <p className="font-serif text-3xl text-ink">Enquiry received.</p>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-mute">{success.notice}</p>
        {success.whatsappUrl ? (
          <a
            href={success.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex bg-slatebrand px-5 py-3 text-sm text-ivory hover:bg-slatedeep"
          >
            Continue on WhatsApp
          </a>
        ) : (
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink">
            WhatsApp will be offered here once the desk saves a business number. Your enquiry is already stored.
          </p>
        )}
      </div>
    );
  }

  const field = "mt-2 w-full border border-line bg-white px-3 py-3 text-sm outline-none focus:border-slatebrand";

  return (
    <form onSubmit={onSubmit} className="grid gap-5" noValidate>
      <div className="absolute -left-[9999px]" aria-hidden>
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="block text-sm">
        Full name
        <input name="fullName" autoComplete="name" required className={field} />
      </label>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm">
          Email address
          <input name="email" type="email" autoComplete="email" required className={field} />
        </label>
        <label className="block text-sm">
          Mobile number
          <input name="mobile" type="tel" autoComplete="tel" required placeholder="9876543210" className={field} />
        </label>
      </div>
      <label className="block text-sm">
        City or destination of interest
        <input name="destination" list="destination-options" required defaultValue={initialDestination} className={field} />
        <datalist id="destination-options">
          {destinations.map((destination) => (
            <option key={destination} value={destination} />
          ))}
        </datalist>
      </label>
      <label className="block text-sm">
        Enquiry message
        <textarea name="message" required rows={6} className={field} />
      </label>
      {error ? (
        <p className="text-sm text-[#8C3A3A]" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className="w-fit bg-slatebrand px-6 py-3 text-sm text-ivory disabled:opacity-60">
        {pending ? "Sending" : "Submit enquiry"}
      </button>
    </form>
  );
}
