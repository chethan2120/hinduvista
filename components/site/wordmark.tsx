export function Wordmark({ tone = "inverse", large = false, sequence = false }: { tone?: "inverse" | "ink"; large?: boolean; sequence?: boolean }) {
  const ink = tone === "inverse" ? "text-ivory" : "text-slatebrand";
  const sub = tone === "inverse" ? "text-ivory/75" : "text-mute";
  const ring = tone === "inverse" ? "border-ivory/35" : "border-slatebrand/25";
  const piece = (delay: number, className = "") =>
    sequence ? { className: `hv-from-left ${className}`.trim(), style: { animationDelay: `${delay}ms` } } : { className };

  return (
    <span className={`inline-flex items-center ${large ? "gap-5" : "gap-3"}`}>
      <span {...piece(80)}>
        <span className={`grid shrink-0 place-items-center rounded-full border ring-1 ring-gold ${ring} ${large ? "h-16 w-16" : "h-9 w-9"}`} aria-hidden>
          <span className={`font-hindi leading-none ${ink} ${large ? "text-3xl" : "text-lg"}`}>ह</span>
        </span>
      </span>
      <span className="block text-left">
        <span className={`flex items-end font-serif font-semibold leading-none ${ink} ${large ? "gap-2 text-5xl md:text-6xl" : "gap-1 text-[1.35rem]"}`}>
          <span {...piece(280, "tracking-[0.12em]")}>V</span>
          <span {...piece(460, "tracking-[0.12em]")}>I</span>
          <span {...piece(660, `font-hindi leading-none text-gold ${large ? "mb-1 text-4xl md:text-5xl" : "mb-0.5 text-[1.2rem]"}`)}>ह</span>
          <span {...piece(860, "tracking-[0.12em]")}>T</span>
          <span {...piece(1040, "tracking-[0.12em]")}>A</span>
        </span>
        <span {...piece(1280, `block leading-none ${sub} ${large ? "mt-3 text-sm" : "mt-1 text-[0.62rem]"}`)}>
          Hinduvista <span className="font-hindi">हिन्दुविस्टा</span>
        </span>
      </span>
    </span>
  );
}
