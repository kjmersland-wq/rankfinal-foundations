import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/rankfinal/ui/SearchBar";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Browse", href: "/browse" },
  { label: "Pricing", href: "/pricing" },
  { label: "Help", href: "/help" },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn("text-sm font-semibold transition-colors hover:text-text-primary", isActive ? "text-accent-amber" : "text-text-secondary");

export function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setHidden(currentY > 96 && currentY > lastY.current && !open);
      lastY.current = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <header className={cn("sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl transition-transform duration-300", hidden && "-translate-y-full")}>
      <nav className="mx-auto flex h-16 w-full max-w-[1280px] items-center gap-4 px-4 sm:px-6 lg:px-8" aria-label="Primary navigation">
        <Link to="/" className="flex shrink-0 items-center gap-2 text-lg font-extrabold tracking-tight text-text-primary" onClick={() => setOpen(false)}>
          <span className="flex size-8 items-center justify-center rounded-input bg-accent-amber text-primary-foreground">
            <Zap className="size-4 fill-current" aria-hidden="true" />
          </span>
          RankFinal
        </Link>

        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <SearchBar containerClassName="max-w-md lg:max-w-xl" />
        </div>

        <div className="hidden items-center gap-5 lg:flex">
          {navItems.map((item) => <NavLink key={item.href} to={item.href} className={navLinkClass}>{item.label}</NavLink>)}
          <NavLink to="/about" className={navLinkClass}>Sign In</NavLink>
          <Button asChild variant="amber" size="pill"><Link to="/pricing">Get Pro <ArrowRight className="size-4" aria-hidden="true" /></Link></Button>
        </div>

        <button className="ml-auto rounded-input border border-border bg-surface p-2 text-text-primary transition-colors hover:border-accent-amber/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden" type="button" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation menu" aria-expanded={open}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="fixed inset-x-0 top-16 z-50 min-h-[calc(100vh-4rem)] border-t border-border bg-background px-4 py-6 animate-slide-in-menu lg:hidden">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-6">
            <SearchBar />
            <div className="flex flex-col gap-1">
              {[...navItems, { label: "Sign In", href: "/about" }].map((item) => (
                <NavLink key={item.href} to={item.href} className="rounded-input px-3 py-3 text-lg font-semibold text-text-primary hover:bg-surface" onClick={() => setOpen(false)}>{item.label}</NavLink>
              ))}
            </div>
            <Button asChild variant="amber" size="lg"><Link to="/pricing" onClick={() => setOpen(false)}>Get Pro <ArrowRight className="size-4" aria-hidden="true" /></Link></Button>
          </div>
        </div>
      )}
    </header>
  );
}
