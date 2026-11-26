type PhotoProps = {
  src?: string | null;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

export function Photo({ src, alt, className = "" }: PhotoProps) {
  if (!src) {
    return <div className={`absolute inset-0 bg-slatebrand ${className}`} aria-hidden />;
  }

  const fit = className.includes("object-contain") ? "object-contain" : "object-cover";
  return <img src={src} alt={alt} className={`absolute inset-0 h-full w-full ${fit} ${className}`} />;
}
