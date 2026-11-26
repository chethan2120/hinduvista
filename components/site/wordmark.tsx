export function Wordmark({ tone = "inverse", large = false }: { tone?: "inverse" | "ink"; large?: boolean }) {
  const ink = tone === "inverse" ? "text-ivory" : "text-slatebrand";
  const sub = tone === "inverse" ? "text-ivory/75" : "text-mute";
  const ring = tone === "inverse" ? "border-ivory/35" : "border-slatebrand/25";

  return (
    <span className={`inline-flex items-center ${large ? "gap-5" : "gap-3"}`}>
      <span className={`grid shrink-0 place-items-center rounded-full border ring-1 ring-gold ${ring} ${large ? "h-16 w-16" : "h-9 w-9"}`} aria-hidden>
        <span className={`font-hindi leading-none ${ink} ${large ? "text-3xl" : "text-lg"}`}>ह</span>
      </span>
      <span className="block text-left">
        <span className={`flex items-end font-serif font-semibold leading-none ${ink} ${large ? "gap-2 text-5xl md:text-6xl" : "gap-1 text-[1.35rem]"}`}>
          <span className="tracking-[0.12em]">VI</span>
          <span className={`font-hindi leading-none text-gold ${large ? "mb-1 text-4xl md:text-5xl" : "mb-0.5 text-[1.2rem]"}`}>ह</span>
          <span className="tracking-[0.12em]">TA</span>
        </span>
        <span className={`block leading-none ${sub} ${large ? "mt-3 text-sm" : "mt-1 text-[0.62rem]"}`}>
          Hinduvista <span className="font-hindi">हिन्दुविस्टा</span>
        </span>
      </span>
    </span>
  );
}
