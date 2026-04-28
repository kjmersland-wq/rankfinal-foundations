'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from './SearchBar';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase-client';

const navItems = [
  { label: 'Browse', href: '/browse' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Help', href: '/help' },
  { label: 'Contact', href: '/contact' },
];

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setHidden(currentY > 96 && currentY > lastY.current && !open);
      lastY.current = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  async function handleGetPro() {
    // Check if user is authenticated
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Redirect to signin with redirect back to pricing
      router.push('/signin?redirect=' + encodeURIComponent('/pricing'));
      return;
    }

    // User is signed in, go to pricing page where they can select a plan
    router.push('/pricing');
  }
  return (
    <header className={cn('sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl transition-transform duration-300', hidden && '-translate-y-full')}>
      <nav className="mx-auto flex h-16 w-full max-w-[1280px] items-center gap-4 px-4 sm:px-6 lg:px-8" aria-label="Primary navigation">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-extrabold tracking-tight text-text-primary" onClick={() => setOpen(false)}>
          <span className="flex size-8 items-center justify-center rounded-input bg-accent-amber text-primary-foreground">
            <Zap className="size-4 fill-current" aria-hidden="true" />
          </span>
          RankFinal
        </Link>
        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <SearchBar containerClassName="max-w-md lg:max-w-xl" />
        </div>
        <div className="hidden items-center gap-5 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-semibold transition-colors hover:text-text-primary',
                isActive(item.href) ? 'text-accent-amber' : 'text-text-secondary'
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/signin"
            className={cn(
              'text-sm font-semibold transition-colors hover:text-text-primary',
              isActive('/signin') ? 'text-accent-amber' : 'text-text-secondary'
            )}
          >
            Sign In
          </Link>
          <Link href="/pricing" className="rounded-pill border border-border bg-secondary px-2.5 py-1 text-xs font-bold text-text-secondary transition-colors hover:border-accent-amber hover:text-accent-amber">
            Free
          </Link>
          <Button asChild variant="amber" size="pill" onClick={handleGetPro}>
            <button type="button">
              Get Pro <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </Button>
        </div>
        <button
          className="ml-auto rounded-input border border-border bg-surface p-2 text-text-primary transition-colors hover:border-accent-amber/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>
      {open && (
        <div className="fixed inset-x-0 top-16 z-50 min-h-[calc(100vh-4rem)] border-t border-border bg-background px-4 py-6 animate-slide-in-menu lg:hidden">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-6">
            <SearchBar />
            <div className="flex flex-col gap-1">
              {[...navItems, { label: 'Sign In', href: '/signin' }, { label: 'Free plan', href: '/pricing' }].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-input px-3 py-3 text-lg font-semibold text-text-primary hover:bg-surface"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <Button variant="amber" size="lg" onClick={() => {
              setOpen(false);
              handleGetPro();
            }}>
              Get Pro <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
