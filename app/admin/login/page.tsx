import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";
import { Photo } from "@/components/site/photo";
import { Wordmark } from "@/components/site/wordmark";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-slatebrand">
      <Photo src="/images/attractions/agra-taj-mahal.webp" alt="" priority sizes="100vw" className="object-[center_40%]" />
      <div className="absolute inset-0 bg-slatedeep/60" />
      <Link href="/" className="absolute left-5 top-5 z-10 text-sm text-ivory underline decoration-gold/70 underline-offset-4 hover:text-gold">
        Main website
      </Link>
      <div className="relative grid min-h-screen lg:grid-cols-2">
        <div className="flex flex-col justify-end px-6 py-12 text-ivory md:px-12 md:py-16 lg:justify-center">
          <Wordmark tone="inverse" />
          <p className="mt-10 text-[0.72rem] uppercase tracking-[0.24em] text-gold">Hindu Vista</p>
          <h1 className="mt-4 max-w-md font-serif text-5xl font-semibold leading-tight md:text-6xl">The desk behind the journey.</h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ivory/80">
            Sign in to keep the cities, the photographs, and the enquiries. The public pages update from what is saved here.
          </p>
        </div>
        <div className="flex items-center justify-center px-4 py-12 md:px-10">
          <div className="w-full max-w-sm bg-ivory px-6 py-7 shadow-2xl">
            <p className="text-[0.72rem] uppercase tracking-[0.22em] text-goldink">Staff desk</p>
            <h2 className="mt-2 font-serif text-3xl">Sign in</h2>
            <div className="mt-5">
              <Suspense>
                <LoginForm />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
