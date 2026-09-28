/** Wraps each character in a masked span so GSAP can slide letters up. */
export function SplitChars({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((word, w) => (
        <span
          key={w}
          className="inline-block whitespace-nowrap"
          aria-hidden="true"
        >
          {[...word].map((ch, i) => (
            <span
              key={i}
              className="inline-block overflow-hidden pb-[0.08em] align-bottom"
            >
              <span data-char className="inline-block will-change-transform">
                {ch}
              </span>
            </span>
          ))}
          {/* keep word spacing */}
          {w < text.split(' ').length - 1 && (
            <span className="inline-block w-[0.35em]" />
          )}
        </span>
      ))}
    </span>
  );
}
