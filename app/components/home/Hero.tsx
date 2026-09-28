import {useEffect, useRef} from 'react';
import {gsap, MOTION, useGSAP} from '~/lib/gsap';
import {hotspotPosition, imageProps, urlFor, type HomePage} from '~/lib/sanity';
import {SplitChars} from './SplitChars';

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 1.4 -0.2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const PLACEMENT: Record<string, string> = {
  left: 'left-[-12%] top-[4%] w-[78vw] md:left-[-4%] md:top-[2%] md:w-[52vw]',
  right:
    'right-[-18%] bottom-[8%] w-[70vw] md:right-[-6%] md:bottom-[-6%] md:w-[42vw]',
  full: 'inset-0 h-full w-full',
};

export function Hero({data}: {data: HomePage}) {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const title = data.heroTitle ?? 'Sedona Lehua';

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION.ok, () => {
        const intro = gsap.timeline({defaults: {ease: 'expo.out'}});
        intro
          .from('[data-hero-media]', {opacity: 0, scale: 1.04, duration: 2})
          .from(
            '[data-hero-layer]',
            {
              opacity: 0,
              scale: 1.12,
              rotate: (i) => (i % 2 ? 4 : -6),
              duration: 2.2,
              stagger: 0.2,
            },
            0.1,
          )
          .from(
            '[data-char]',
            {yPercent: 110, duration: 1.2, stagger: 0.035},
            0.3,
          )
          .from('[data-hero-hint]', {opacity: 0, y: 12, duration: 1}, 1.1);

        // Scroll: layers drift at different depths, title lifts away.
        const scroll = {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        };
        gsap.to('[data-hero-media]', {
          yPercent: 18,
          scale: 1.03,
          ease: 'none',
          scrollTrigger: scroll,
        });
        gsap.utils
          .toArray<HTMLElement>('[data-hero-layer]')
          .forEach((el, i) => {
            gsap.to(el, {
              yPercent: i % 2 ? -35 : -18,
              rotate: i % 2 ? -3 : 8,
              ease: 'none',
              scrollTrigger: scroll,
            });
          });
        gsap.to('[data-hero-title]', {
          yPercent: -60,
          opacity: 0,
          ease: 'none',
          scrollTrigger: scroll,
        });

        // Idle breathing on the flower so the frame never feels static.
        gsap.to('[data-hero-layer="0"] img', {
          rotate: 3,
          scale: 1.03,
          duration: 9,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      });

      return () => mm.revert();
    },
    {scope: root},
  );

  // React doesn't serialize `muted` into SSR HTML, so browsers treat the video
  // as unmuted and block autoplay. Set it on the element and start it here.
  useEffect(() => {
    const el = video.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return;
    el.muted = true;
    el.play().catch(() => {});
  }, []);

  const poster = data.heroPoster
    ? urlFor(data.heroPoster).width(1600).url()
    : undefined;

  return (
    <section
      ref={root}
      className="relative h-[100svh] min-h-[560px] overflow-hidden bg-[#a79c86] text-shell"
    >
      <div
        data-hero-media
        className="absolute inset-0 will-change-transform [filter:blur(2px)_brightness(1.3)_contrast(0.85)_saturate(0.75)_sepia(0.15)]"
      >
        {data.heroVideoUrl ? (
          <video
            ref={video}
            className="h-full w-full scale-[1.04] object-cover motion-reduce:hidden"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={poster}
            aria-hidden="true"
          >
            {data.heroVideoMobileUrl && (
              <source
                src={data.heroVideoMobileUrl}
                type="video/mp4"
                media="(max-width: 767px)"
              />
            )}
            <source src={data.heroVideoUrl} type="video/mp4" />
          </video>
        ) : null}
        {data.heroPoster && (
          <img
            alt={data.heroPoster.alt ?? ''}
            {...imageProps(data.heroPoster, {widths: [800, 1400, 2000]})}
            sizes="100vw"
            className={`absolute inset-0 h-full w-full object-cover ${
              data.heroVideoUrl ? 'hidden motion-reduce:block' : ''
            }`}
            style={{objectPosition: hotspotPosition(data.heroPoster)}}
          />
        )}
      </div>

      {data.heroLayers?.map((layer, i) => (
        <div
          key={layer._key}
          data-hero-layer={i}
          className={`pointer-events-none absolute will-change-transform ${PLACEMENT[layer.placement ?? 'left']}`}
          style={{
            opacity: layer.opacity ?? 0.6,
            mixBlendMode: (layer.blend ??
              'normal') as React.CSSProperties['mixBlendMode'],
          }}
        >
          <img
            {...imageProps(layer.image, {widths: [600, 1000, 1400]})}
            sizes="(min-width: 768px) 50vw, 80vw"
            alt=""
            className="h-auto w-full"
            loading="eager"
          />
        </div>
      ))}

      {/* Film grain — gives the (soft) footage an intentional, analog texture. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[50%] animate-[grain_1s_steps(6)_infinite] opacity-[0.22] mix-blend-overlay motion-reduce:animate-none"
        style={{backgroundImage: GRAIN, backgroundSize: '180px 180px'}}
      />

      {/* Soft scrims keep the nav + title legible over bright frames. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/20 to-transparent" />

      <div className="relative flex h-full items-center justify-center px-5">
        <h1
          data-hero-title
          className="font-display text-center text-[clamp(2.6rem,9.5vw,9.5rem)] leading-none tracking-[0.16em] uppercase [text-shadow:0_1px_30px_rgba(0,0,0,0.12)]"
        >
          <SplitChars text={title} />
        </h1>
      </div>

      <div
        data-hero-hint
        className="text-eyebrow absolute inset-x-0 bottom-8 flex flex-col items-center gap-3"
      >
        <span>Scroll</span>
        <span className="block h-10 w-px origin-top animate-[hint_2.4s_ease-in-out_infinite] bg-current" />
      </div>
    </section>
  );
}
