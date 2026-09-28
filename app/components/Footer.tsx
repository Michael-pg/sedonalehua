import {Link} from 'react-router';
import {NAV} from '~/components/Header';

const SECONDARY = [
  {to: '/policies', label: 'Shipping & Returns'},
  {to: '/search', label: 'Search'},
  {to: '/account', label: 'Account'},
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-linen bg-sand text-ink">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-16 md:grid-cols-12 md:px-10 md:py-24">
        <div className="md:col-span-6">
          <p className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] tracking-[0.08em] uppercase">
            Sedona
            <br />
            Lehua
          </p>
        </div>
        <nav className="flex flex-col gap-3 md:col-span-2" aria-label="Footer">
          <p className="text-eyebrow mb-2 text-driftwood">Visit</p>
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              prefetch="intent"
              className="hover:text-protea"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <nav className="flex flex-col gap-3 md:col-span-2" aria-label="Help">
          <p className="text-eyebrow mb-2 text-driftwood">Help</p>
          {SECONDARY.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              prefetch="intent"
              className="hover:text-protea"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-3 md:col-span-2">
          <p className="text-eyebrow mb-2 text-driftwood">Follow</p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-protea"
          >
            Instagram
          </a>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1600px] justify-between border-t border-linen px-5 py-6 text-xs text-driftwood md:px-10">
        <span>© {new Date().getFullYear()} Sedona Lehua</span>
        <span>Made slowly, by the water</span>
      </div>
    </footer>
  );
}
