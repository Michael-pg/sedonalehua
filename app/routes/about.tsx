import {useRef} from 'react';
import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/about';
import {gsap, MOTION, useGSAP} from '~/lib/gsap';
import {imageProps, type SanityImage} from '~/lib/sanity';
import {sanity} from '~/lib/sanity.server';

export const meta: Route.MetaFunction = () => [{title: 'About — Sedona Lehua'}];

interface AboutData {
  aboutHeading?: string;
  aboutBody?: string;
  aboutImage?: SanityImage;
  journalImages?: (SanityImage & {_key: string})[];
}

export async function loader() {
  // Reuses the home page's about + journal fields until a dedicated
  // aboutPage document is designed.
  const about = await sanity.fetch<AboutData | null>(
    `*[_id == "homePage"][0]{aboutHeading, aboutBody, aboutImage, journalImages}`,
  );
  return {about: about ?? {}};
}

export default function About() {
  const {about} = useLoaderData<typeof loader>();
  const root = useRef<HTMLDivElement>(null);
  const [lead, ...rest] = about.journalImages ?? [];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        gsap.from('[data-about-line]', {
          yPercent: 100,
          opacity: 0,
          stagger: 0.12,
          duration: 1.4,
          ease: 'expo.out',
        });
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            y: 50,
            opacity: 0,
            duration: 1.3,
            ease: 'expo.out',
            scrollTrigger: {trigger: el, start: 'top 88%'},
          });
        });
      });
      return () => mm.revert();
    },
    {scope: root},
  );

  return (
    <div ref={root}>
      <section className="mx-auto max-w-[1600px] px-5 pt-12 pb-16 md:px-10 md:pt-24 md:pb-28">
        <p className="text-eyebrow mb-6 text-driftwood">About</p>
        <h1 className="font-display text-[clamp(2.75rem,8vw,7.5rem)] leading-[0.95]">
          <span className="block overflow-hidden">
            <span data-about-line className="block">
              Made slowly,
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-about-line className="block italic">
              by the water.
            </span>
          </span>
        </h1>
      </section>

      <section className="grid border-t border-linen md:grid-cols-2">
        {about.aboutImage && (
          <div className="border-linen p-5 md:border-r md:p-16">
            <div data-reveal className="aspect-[4/5] overflow-hidden bg-sand">
              <img
                alt={about.aboutImage.alt ?? ''}
                {...imageProps(about.aboutImage, {
                  aspect: 4 / 5,
                  widths: [600, 1000, 1400],
                })}
                sizes="(min-width: 768px) 45vw, 100vw"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}
        <div className="flex flex-col justify-center gap-6 px-5 pb-16 md:px-16 md:py-16">
          <h2 data-reveal className="font-display text-4xl md:text-5xl">
            {about.aboutHeading}
          </h2>
          <p
            data-reveal
            className="max-w-md text-[15px] leading-relaxed text-ink/80"
          >
            {about.aboutBody}
          </p>
          <p
            data-reveal
            className="max-w-md text-[15px] leading-relaxed text-ink/80"
          >
            Placeholder — a second paragraph on materials, process and where the
            pieces are made.
          </p>
        </div>
      </section>

      {lead && (
        <section className="border-t border-linen px-5 py-20 md:px-10 md:py-32">
          <div className="mx-auto grid max-w-[1600px] gap-5 md:grid-cols-12">
            <figure data-reveal className="md:col-span-6 md:row-span-2">
              <div className="aspect-[3/4] overflow-hidden bg-sand">
                <img
                  alt={lead.alt ?? ''}
                  {...imageProps(lead, {
                    aspect: 3 / 4,
                    widths: [600, 1000, 1400],
                  })}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="text-eyebrow mt-3 text-driftwood">
                {lead.caption}
              </figcaption>
            </figure>
            {rest.slice(0, 2).map((image, i) => (
              <figure
                key={image._key}
                data-reveal
                className={`md:col-span-4 ${i === 0 ? 'md:col-start-8 md:mt-24' : 'md:col-start-7'}`}
              >
                <div className="aspect-[4/5] overflow-hidden bg-sand">
                  <img
                    alt={image.alt ?? ''}
                    {...imageProps(image, {
                      aspect: 4 / 5,
                      widths: [500, 800, 1100],
                    })}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="text-eyebrow mt-3 text-driftwood">
                  {image.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-linen bg-sand px-5 py-20 text-center md:py-28">
        <p className="font-display mx-auto max-w-3xl text-3xl leading-tight md:text-5xl">
          Bridal and made-to-order by appointment.
        </p>
        <Link
          to="/collections/all"
          className="text-eyebrow mt-8 inline-block border-b border-current pb-0.5"
        >
          Explore the collection
        </Link>
      </section>
    </div>
  );
}
