"use client";

export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-6 py-32">
      <h1 className="font-serif text-4xl">This page could not be opened.</h1>
      <p className="mt-4 text-sm text-mute">Refresh the page. If it continues, the desk can check the server log.</p>
      <button type="button" onClick={reset} className="mt-6 bg-slatebrand px-5 py-3 text-sm text-ivory">
        Try again
      </button>
    </div>
  );
}
