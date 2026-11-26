"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, MediaSelect, inputClass, type MediaOption } from "@/components/admin/fields";
import { ABOUT_KEYS, HOMEPAGE_KEYS, SETTINGS_KEYS, readWhyItems, type WhyItem } from "@/lib/defaults";

async function saveValues(values: Record<string, string>) {
  const response = await fetch("/api/admin/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ values }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Could not save.");
}

function useSaver() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);

  async function run(task: () => Promise<void>) {
    setPending(true);
    setError("");
    setSaved(false);
    try {
      await task();
      setSaved(true);
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save.");
    } finally {
      setPending(false);
    }
  }

  return { error, pending, saved, run };
}

function Status({ pending, saved, error }: { pending: boolean; saved: boolean; error: string }) {
  return (
    <div className="flex items-center gap-4">
      <button type="submit" disabled={pending} className="bg-slatebrand px-5 py-3 text-sm text-ivory disabled:opacity-60">
        {pending ? "Saving" : "Save"}
      </button>
      {saved ? <p className="text-sm">Saved.</p> : null}
      {error ? <p className="text-sm text-[#8C3A3A]">{error}</p> : null}
    </div>
  );
}

export function HomepageForm({ settings, assets }: { settings: Record<string, string>; assets: MediaOption[] }) {
  const [values, setValues] = useState(settings);
  const [why, setWhy] = useState<WhyItem[]>(readWhyItems(settings.why_items));
  const saver = useSaver();

  function set(key: string, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {
      ...values,
      why_items: JSON.stringify(why.map((item) => ({ title: item.title.trim(), text: item.text.trim() })).filter((item) => item.title && item.text)),
    };
    const payload = Object.fromEntries(HOMEPAGE_KEYS.map((key) => [key, next[key] ?? ""]));
    await saver.run(() => saveValues(payload));
  }

  const textKeys = [
    ["hero_eyebrow", "Hero label"],
    ["hero_title", "Hero headline"],
    ["hero_text", "Hero text"],
    ["intro_eyebrow", "Introduction label"],
    ["intro_title", "Introduction headline"],
    ["intro_text", "Introduction text"],
    ["cities_eyebrow", "Cities label"],
    ["cities_title", "Cities headline"],
    ["cities_note", "Sample notice under the cities"],
    ["attractions_eyebrow", "Places label"],
    ["attractions_title", "Places headline"],
    ["why_eyebrow", "Practice label"],
    ["why_title", "Practice headline"],
    ["inspiration_eyebrow", "Frames label"],
    ["inspiration_title", "Frames headline"],
    ["inspiration_text", "Frames text"],
    ["enquiry_title", "Enquiry headline"],
    ["enquiry_text", "Enquiry text"],
  ] as const;

  return (
    <form onSubmit={onSubmit} className="grid max-w-3xl gap-5">
      {textKeys.map(([key, label]) => (
        <Field key={key} label={label}>
          {key.endsWith("_text") || key === "cities_note" ? (
            <textarea className={inputClass} rows={4} value={values[key] || ""} onChange={(event) => set(key, event.target.value)} />
          ) : (
            <input className={inputClass} value={values[key] || ""} onChange={(event) => set(key, event.target.value)} />
          )}
        </Field>
      ))}
      <MediaSelect label="Main hero photograph" assets={assets} value={values.hero_image || ""} onChange={(value) => set("hero_image", value)} />
      <MediaSelect label="Second hero photograph" assets={assets} value={values.hero_image_secondary || ""} onChange={(value) => set("hero_image_secondary", value)} />
      <MediaSelect label="Third hero photograph" assets={assets} value={values.hero_image_tertiary || ""} onChange={(value) => set("hero_image_tertiary", value)} />
      <MediaSelect label="Introduction photograph" assets={assets} value={values.intro_image_primary || ""} onChange={(value) => set("intro_image_primary", value)} />
      <MediaSelect label="Second introduction photograph" assets={assets} value={values.intro_image_secondary || ""} onChange={(value) => set("intro_image_secondary", value)} />
      {["inspiration_1", "inspiration_2", "inspiration_3", "inspiration_4"].map((key, index) => (
        <MediaSelect key={key} label={`Inspiration photograph ${index + 1}`} assets={assets} value={values[key] || ""} onChange={(value) => set(key, value)} />
      ))}
      <div className="space-y-4 border border-line p-4">
        <p className="text-sm">Why travel with the desk</p>
        {why.map((item, index) => (
          <div key={index} className="grid gap-2">
            <input className={inputClass} value={item.title} onChange={(event) => setWhy(why.map((entry, entryIndex) => (entryIndex === index ? { ...entry, title: event.target.value } : entry)))} />
            <textarea className={inputClass} rows={3} value={item.text} onChange={(event) => setWhy(why.map((entry, entryIndex) => (entryIndex === index ? { ...entry, text: event.target.value } : entry)))} />
          </div>
        ))}
        <button type="button" className="text-sm" onClick={() => setWhy([...why, { title: "", text: "" }])}>
          Add a point
        </button>
      </div>
      <Status {...saver} />
    </form>
  );
}

export function AboutForm({ settings, assets }: { settings: Record<string, string>; assets: MediaOption[] }) {
  const [values, setValues] = useState(settings);
  const saver = useSaver();
  const keys = [...ABOUT_KEYS, "contact_eyebrow", "contact_title", "contact_text"] as const;
  const textKeys = keys.filter((key) => !key.includes("image"));

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await saver.run(() => saveValues(Object.fromEntries(keys.map((key) => [key, values[key] || ""]))));
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-3xl gap-5">
      {textKeys.map((key) => (
        <Field key={key} label={key.replaceAll("_", " ")}>
          {key.endsWith("text") ? (
            <textarea className={inputClass} rows={6} value={values[key] || ""} onChange={(event) => setValues({ ...values, [key]: event.target.value })} />
          ) : (
            <input className={inputClass} value={values[key] || ""} onChange={(event) => setValues({ ...values, [key]: event.target.value })} />
          )}
        </Field>
      ))}
      <MediaSelect label="About photograph" assets={assets} value={values.about_image_primary || ""} onChange={(value) => setValues({ ...values, about_image_primary: value })} />
      <MediaSelect label="Second about photograph" assets={assets} value={values.about_image_secondary || ""} onChange={(value) => setValues({ ...values, about_image_secondary: value })} />
      <Status {...saver} />
    </form>
  );
}

export function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const [values, setValues] = useState(settings);
  const saver = useSaver();
  const keys = SETTINGS_KEYS.filter((key) => !["contact_eyebrow", "contact_title", "contact_text"].includes(key));

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await saver.run(() => saveValues(Object.fromEntries(keys.map((key) => [key, values[key] || ""]))));
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-3xl gap-5">
      <p className="text-sm leading-relaxed text-mute">
        Leave telephone, email, address and WhatsApp blank until the client confirms them. Do not invent a number. Email notifications are sent only after SMTP credentials are added to the server environment.
      </p>
      {keys.map((key) => (
        <Field key={key} label={key.replaceAll("_", " ")}>
          {key.endsWith("text") || key.endsWith("notice") || key === "contact_address" || key === "whatsapp_preface" || key === "seo_description" ? (
            <textarea className={inputClass} rows={4} value={values[key] || ""} onChange={(event) => setValues({ ...values, [key]: event.target.value })} />
          ) : (
            <input className={inputClass} value={values[key] || ""} onChange={(event) => setValues({ ...values, [key]: event.target.value })} />
          )}
        </Field>
      ))}
      <Status {...saver} />
    </form>
  );
}

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [values, setValues] = useState({ name, email, currentPassword: "", newPassword: "" });
  const saver = useSaver();

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await saver.run(async () => {
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not update the profile.");
      setValues((current) => ({ ...current, currentPassword: "", newPassword: "" }));
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-xl gap-5">
      <Field label="Name">
        <input className={inputClass} value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} required />
      </Field>
      <Field label="Email">
        <input className={inputClass} type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} required />
      </Field>
      <Field label="Current password">
        <input className={inputClass} type="password" value={values.currentPassword} onChange={(event) => setValues({ ...values, currentPassword: event.target.value })} required />
      </Field>
      <Field label="New password">
        <input className={inputClass} type="password" value={values.newPassword} onChange={(event) => setValues({ ...values, newPassword: event.target.value })} placeholder="Leave blank to keep the current password" />
      </Field>
      <Status {...saver} />
    </form>
  );
}
