/** The mark: a doorway (umbral = threshold) with a sill line. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 40" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden>
      <path d="M5 37V9a11 11 0 0 1 22 0v28" />
      <path d="M11 37V12a5 5 0 0 1 10 0v25" />
      <path d="M1 37.5h30" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark className="h-7 w-auto" />
      <span className="font-display font-medium text-[1.35rem] leading-none tracking-[0.18em] uppercase">Umbral</span>
    </span>
  );
}
