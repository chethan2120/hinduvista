import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-6 py-32">
      <p className="text-[0.72rem] uppercase tracking-[0.22em] text-goldink">404</p>
      <h1 className="mt-4 font-serif text-5xl">This page is not on the journey.</h1>
      <p className="mt-4 text-sm leading-relaxed text-mute">The city or place may be unpublished, or the address may be wrong.</p>
      <Link href="/" className="mt-8 inline-flex bg-slatebrand px-5 py-3 text-sm text-ivory">
        Return home
      </Link>
    </div>
  );
}
