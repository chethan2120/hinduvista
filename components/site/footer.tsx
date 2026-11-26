import Link from "next/link";
import { Wordmark } from "@/components/site/wordmark";

export function Footer({
  brand,
  hindi,
  text,
}: {
  brand: string;
  hindi: string;
  text: string;
}) {
  return (
    <footer className="relative overflow-hidden bg-slatebrand text-ivory">
      <p
        aria-hidden
        className="pointer-events-none absolute -bottom-8 left-0 select-none font-serif text-[16vw] font-semibold leading-none tracking-tight text-white/[0.06]"
      >
        Hindu Vista
      </p>
      <div className="relative mx-auto grid max-w-page gap-10 px-5 py-16 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Wordmark />
          <p className="sr-only">
            {brand}
            {hindi ? `, ${hindi}` : ""}
          </p>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ivory/75">{text}</p>
        </div>
        <div className="lg:col-span-3">
          <p className="text-[0.72rem] uppercase tracking-[0.22em] text-gold">Visit</p>
          <ul className="mt-4 space-y-2 text-sm text-ivory/85">
            <li>
              <Link href="/#about">About</Link>
            </li>
            <li>
              <Link href="/#cities">Cities</Link>
            </li>
            <li>
              <Link href="/#why">Why us</Link>
            </li>
            <li>
              <Link href="/#stories">Testimonials</Link>
            </li>
            <li>
              <Link href="/#questions">FAQ</Link>
            </li>
            <li>
              <Link href="/#enquire">Enquiry</Link>
            </li>
            <li>
              <Link href="/credits">Photograph credits</Link>
            </li>
          </ul>
        </div>
        <div className="lg:col-span-4">
          <p className="text-[0.72rem] uppercase tracking-[0.22em] text-gold">Desk</p>
          <p className="mt-4 text-sm leading-relaxed text-ivory/75">
            The desk keeps enquiries from this page and can mark each one new, contacted, or closed. A telephone number, email address, and office are added here only when they have been confirmed. WhatsApp is offered with the same message once a business number is saved.
          </p>
          <Link href="/admin" className="mt-4 inline-block text-sm text-ivory/60 hover:text-gold">
            Login
          </Link>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-page flex-col gap-3 px-5 py-5 text-sm text-ivory/70 md:flex-row md:items-center md:justify-between md:px-10">
          <p>© 2026 Hindu Vista. All rights reserved.</p>
          <p>
            Designed and Maintained by{" "}
            <a href="https://webnxt.co/" className="text-gold underline decoration-gold/40 underline-offset-4 hover:text-ivory">
              WebNxt
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
