import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock, Search, TrendingUp } from "lucide-react";
import { categories } from "@/data/categories";
import { suggestedQueries } from "@/data/searchResults";
import { cn } from "@/lib/utils";

interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onSubmit"> {
  containerClassName?: string;
}

const RECENT_SEARCHES_KEY = "rankfinal_recent_searches";
const trendingNow = ["Best EV 2026", "Best smartphone under €800", "Best electricity provider UK"];

function detectCountry() {
  if (typeof navigator === "undefined") return "US";
  const locale = navigator.language || "en-US";
  const region = locale.split("-")[1];
  return (region || "US").toUpperCase();
}

function readRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]") as string[];
  } catch {
    return [];
  }
}

function storeRecentSearch(query: string) {
  const next = [query, ...readRecentSearches().filter((item) => item.toLowerCase() !== query.toLowerCase())].slice(0, 5);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
}

export function SearchBar({ className, containerClassName, defaultValue, placeholder, ...props }: SearchBarProps) {
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLFormElement>(null);
  const [query, setQuery] = useState(String(defaultValue ?? ""));
  const [focused, setFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const country = useMemo(() => detectCountry(), []);

  useEffect(() => {
    setRecentSearches(readRecentSearches());
  }, [focused]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setFocused(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const suggestions = suggestedQueries
    .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5);
  const showDropdown = focused && query.length >= 2;

  const submitQuery = (value: string) => {
    const clean = value.trim();
    if (!clean) return;
    storeRecentSearch(clean);
    setRecentSearches(readRecentSearches());
    setFocused(false);
    navigate(`/search?q=${encodeURIComponent(clean)}&country=${country}`);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submitQuery(query);
  };

  return (
    <form ref={wrapperRef} onSubmit={handleSubmit} className={cn("relative w-full max-w-xl transition-all duration-300 focus-within:max-w-2xl", containerClassName)}>
      <label className="group flex h-full min-h-11 w-full items-center gap-3 rounded-input border border-border bg-surface px-4 transition-all duration-300 focus-within:border-accent-amber/70 focus-within:shadow-amber">
        <Search className="size-4 text-text-secondary transition-colors group-focus-within:text-accent-amber" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setFocused(true)}
          className={cn("h-full min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary", className)}
          placeholder={placeholder ?? "Search rankings, countries, categories..."}
          autoComplete="off"
          {...props}
        />
        <span className="hidden rounded-pill border border-border bg-background px-2 py-1 text-[10px] font-bold text-text-secondary sm:inline-flex">{country}</span>
      </label>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 max-h-[min(74vh,560px)] overflow-auto rounded-card border border-border bg-surface p-3 text-left shadow-surface animate-fade-in">
          <div className="space-y-4">
            <section>
              <h3 className="px-2 pb-2 text-xs font-extrabold uppercase tracking-wide text-text-secondary">Top suggestions</h3>
              <div className="space-y-1">
                {suggestions.map((item, index) => (
                  <button key={item} type="button" onClick={() => submitQuery(item)} className="flex w-full items-center gap-3 rounded-input px-2 py-2 text-sm font-semibold text-text-primary transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <span className="text-lg" aria-hidden="true">{categories[index % categories.length].icon}</span>
                    <span className="flex-1 truncate text-left">{item}</span>
                    <ArrowRight className="size-4 text-accent-amber" />
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="flex items-center gap-2 px-2 pb-2 text-xs font-extrabold uppercase tracking-wide text-text-secondary"><TrendingUp className="size-3" /> Trending now</h3>
              <div className="grid gap-1 sm:grid-cols-3">
                {trendingNow.map((item) => <button key={item} type="button" onClick={() => submitQuery(item)} className="rounded-input bg-background px-3 py-2 text-left text-xs font-bold text-text-primary hover:bg-secondary">{item}</button>)}
              </div>
            </section>

            {recentSearches.length > 0 && (
              <section>
                <h3 className="flex items-center gap-2 px-2 pb-2 text-xs font-extrabold uppercase tracking-wide text-text-secondary"><Clock className="size-3" /> Recently viewed</h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((item) => <button key={item} type="button" onClick={() => submitQuery(item)} className="rounded-pill border border-border px-3 py-1.5 text-xs font-semibold text-text-secondary hover:border-accent-amber hover:text-accent-amber">{item}</button>)}
                </div>
              </section>
            )}

            <section>
              <h3 className="px-2 pb-2 text-xs font-extrabold uppercase tracking-wide text-text-secondary">Category shortcuts</h3>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 8).map((category) => <button key={category.id} type="button" onClick={() => submitQuery(category.name)} className="rounded-pill border border-border bg-background px-3 py-1.5 text-xs font-semibold text-text-secondary hover:border-accent-amber hover:text-accent-amber"><span aria-hidden="true">{category.icon}</span> {category.name}</button>)}
              </div>
            </section>
          </div>
        </div>
      )}
    </form>
  );
}
