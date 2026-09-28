import {Fragment, useRef} from 'react';
import {gsap, MOTION, useGSAP} from '~/lib/gsap';
import {imageProps, type SanityImage} from '~/lib/sanity';

/** Splits "plain *italic* plain" into word tokens with an italic flag. */
function tokens(text: string) {
  const out: {word: string; italic: boolean}[] = [];
  text.split('*').forEach((chunk, i) => {
    for (const word of chunk.split(/\s+/).filter(Boolean)) {
      // Punctuation left behind by a closing * sticks to the previous word.
      if (/^[.,;:!?]+$/.test(word) && out.length)
        out[out.length - 1].word += word;
      else out.push({word, italic: i % 2 === 1});
    }
  });
  return out;
}

export function Statement({
  text,
  images = [],
}: {
  text: string;
  images?: SanityImage[];
}) {
  const root = useRef<HTMLElement>(null);
  const words = tokens(text);
  // Inline images sit before the 2nd word and ~60% through. Each is glued to
  // the word after it (nowrap) so an image never dangles at a line edge.
  const slots = new Map<number, SanityImage>();
  if (images[0]) slots.set(1, images[0]);
  if (images[1])
    slots.set(Math.max(2, Math.floor(words.length * 0.6)), images[1]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        gsap.fromTo(
          '[data-word]',
          {opacity: 0.14},
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: {
              trigger: root.current,
              start: 'top 80%',
              end: 'bottom 55%',
              scrub: true,
            },
          },
        );
        // Space is reserved up front; only a mask animates, so text never reflows.
        const reveal = {
          duration: 1.4,
          ease: 'expo.inOut',
          stagger: 0.3,
          scrollTrigger: {trigger: root.current, start: 'top 70%'},
        };
        gsap.from('[data-inline-img]', {
          clipPath: 'inset(0% 100% 0% 0%)',
          ...reveal,
        });
        gsap.from('[data-inline-img] img', {scale: 1.35, ...reveal});
      });
      return () => mm.revert();
    },
    {scope: root},
  );

  return (
    <section
      ref={root}
      className="border-y border-linen bg-sand px-5 py-24 md:px-10 md:py-40"
    >
      <p className="font-display mx-auto max-w-[1400px] text-[clamp(1.9rem,5.4vw,5.25rem)] leading-[1.04] text-pretty uppercase">
        {words.map(({word, italic}, i) => {
          const image = slots.get(i);
          const text = (
            <span data-word className={italic ? 'normal-case italic' : ''}>
              {word}
            </span>
          );
          return (
            <Fragment key={`${i}-${word}`}>
              {image ? (
                <span className="whitespace-nowrap">
                  <span
                    data-inline-img
                    className="relative mr-[0.25em] inline-block h-[0.82em] w-[1.3em] overflow-hidden align-[-0.04em]"
                  >
                    <img
                      {...imageProps(image, {
                        aspect: 1.3 / 0.82,
                        widths: [240, 480],
                      })}
                      sizes="(min-width: 768px) 140px, 60px"
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </span>
                  {text}
                </span>
              ) : (
                text
              )}{' '}
            </Fragment>
          );
        })}
      </p>
    </section>
  );
}
