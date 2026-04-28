import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-6xl font-extrabold text-text-primary">404</h1>
          <h2 className="text-2xl font-bold text-text-primary">Page not found</h2>
          <p className="text-text-secondary">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved or deleted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default" className="bg-accent-amber text-primary-foreground hover:bg-accent-amber/90">
            <Link href="/">
              <Home className="size-4 mr-2" />
              Go home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/browse">
              <Search className="size-4 mr-2" />
              Browse rankings
            </Link>
          </Button>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-sm text-text-secondary">
            Need help?{' '}
            <Link href="/contact" className="text-accent-amber hover:underline font-semibold">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
