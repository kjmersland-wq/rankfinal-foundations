import Link from 'next/link';
import { Zap } from 'lucide-react';

const columns = [
  { title: 'Explore', links: [{ label: 'Browse', href: '/browse' }, { label: 'Search', href: '/search' }, { label: 'Pricing', href: '/pricing' }] },
  { title: 'Company', links: [{ label: 'About', href: '/about' }, { label: 'Help', href: '/help' }, { label: 'Contact', href: '/contact' }] },
  { title: 'Legal', links: [{ label: 'Privacy', href: '/privacy' }, { label: 'Terms', href: '/terms' }, { label: 'Cookies', href: '/cookies' }, { label: 'Disclaimer', href: '/disclaimer' }] },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_2fr] lg:px-8">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-extrabold text-text-primary">
            <span className="flex size-8 items-center justify-center rounded-input bg-accent-amber text-primary-foreground">
              <Zap className="size-4 fill-current" aria-hidden="true" />
            </span>
            RankFinal
          </Link>
          <p className="max-w-sm text-sm leading-6 text-text-secondary">Definitive ranking infrastructure for categories, countries, and competitive decisions.</p>
          <p className="text-sm font-medium text-text-secondary">Built by KM TECH LABS · Kristiansand, Norway</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title} className="space-y-3">
              <h2 className="text-sm font-bold text-text-primary">{column.title}</h2>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-text-secondary transition-colors hover:text-accent-amber">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border px-4 py-5 text-center text-sm text-text-secondary">© 2026 RankFinal.com</div>
    </footer>
  );
}
