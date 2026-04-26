import { useEffect, useMemo, useRef, useState } from "react";
import { Award, BadgeCheck, CalendarCheck, Earth, ShieldOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, SearchBar } from "@/components/rankfinal/ui";
import { PageWrapper } from "@/components/rankfinal/layout";
import { CategoryCard } from "@/components/rankfinal/CategoryCard";
import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";

const typewriterPhrases = [
  "smartphone",
  "car insurance",
  "electricity provider",
  "electric car",
  "bank",
];

const trendingTags = [
  "Best EV 2026",
  "Cheapest electricity UK",
  "Top smartphone",
  "Best travel insurance",
  "Home loan Norway",
];

const trustStats = [
  { icon: Earth, value: 50, suffix: "+", text: "countries" },
  { icon: Award, value: 10000, suffix: "+", text: "verified tests" },
  { icon: ShieldOff, label: "No sponsored content" },
  { icon: CalendarCheck, label: "Updated daily" },
  { icon: BadgeCheck, value: 100, suffix: "%", text: "independent" },
];

const steps = [
  {
    icon: "🔍",
    title: "Ask",
    description: "Type what you need in plain language",
  },
  {
    icon: "🧠",
    title: "Analyze",
    description: "AI scans verified tests from 50+ countries, removes bias and sponsored content",
  },
  {
    icon: "✅",
    title: "Decide",
    description: "One clear recommendation, full source transparency",
  },
];

const updates = [
  "🔄 Updated 2h ago: Best EV insurance Norway",
  "🔄 Updated 4h ago: Best home insurance UK",
  "🔄 Updated 1h ago: Best smartphone under €800",
  "🔄 Updated 6h ago: Best electricity provider Germany",
];

function useTypewriter(words: string[]) {
  const [wordIndex, setWordIndex] = useState(0);
  const [visibleLength, setVisibleLength] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    const complete = visibleLength === currentWord.length;
    const empty = visibleLength === 0;
    const delay = complete && !deleting ? 1500 : deleting ? 34 : 58;

    const timeout = window.setTimeout(() => {
      if (!deleting && complete) {
        setDeleting(true);
        return;
      }

      if (deleting && empty) {
        setDeleting(false);
        setWordIndex((index) => (index + 1) % words.length);
        return;
      }

      setVisibleLength((length) => length + (deleting ? -1 : 1));
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [deleting, visibleLength, wordIndex, words]);

  return words[wordIndex].slice(0, visibleLength);
}

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      let frame = 0;
      const total = 50;
      const tick = () => {
        frame += 1;
        const progress = 1 - Math.pow(1 - frame / total, 3);
        setDisplay(Math.round(value * Math.min(progress, 1)));
        if (frame < total) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.unobserve(entry.target);
    }, { threshold: 0.6 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>;
}

function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.18 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn(visible ? "animate-fade-in opacity-100" : "opacity-0", className)}>
      {children}
    </div>
  );
}

const Index = () => {
  const typedText = useTypewriter(typewriterPhrases);
  const tickerItems = useMemo(() => [...updates, ...updates], []);

  return (
    <PageWrapper className="space-y-8 py-5 sm:py-6 lg:py-8">
      <section className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-5 pt-3 text-center sm:pt-6 lg:min-h-[360px]">
        <Reveal className="space-y-5">
          <Badge variant="amber">RankFinal.com</Badge>
          <div className="space-y-3">
            <h1 className="mx-auto max-w-5xl text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
              Find the best <span className="text-accent-amber">{typedText}</span>
              <span className="ml-1 inline-block h-9 w-1 translate-y-1 bg-accent-amber animate-caret sm:h-12 lg:h-14" aria-hidden="true" /> for you.
            </h1>
            <p className="text-lg font-medium text-text-secondary sm:text-xl">One answer. Verified sources. No noise.</p>
          </div>
          <div className="mx-auto w-full max-w-3xl">
            <SearchBar
              containerClassName="h-14 max-w-none px-5 focus-within:max-w-none sm:h-16"
              className="text-base"
              placeholder="What are you looking for? e.g. best home insurance Norway"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2.5">
            {trendingTags.map((tag) => (
              <button
                key={tag}
                className="rounded-pill border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-secondary transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-amber/70 hover:text-accent-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                type="button"
              >
                {tag}
              </button>
            ))}
          </div>
        </Reveal>
      </section>

      <Reveal>
        <section className="grid gap-3 rounded-card border border-border bg-surface p-3 shadow-surface sm:grid-cols-2 lg:grid-cols-5" aria-label="Trust indicators">
          {trustStats.map((stat) => {
            const Icon = stat.icon;
            const label = "label" in stat ? stat.label : `${stat.value}${stat.suffix} ${stat.text}`;
            return (
              <div key={label} className="flex items-center gap-3 rounded-input px-3 py-4 transition-colors hover:bg-secondary">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-accent-amber/15 text-accent-amber">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-bold text-text-primary">
                  {"value" in stat ? <><CountUp value={stat.value} suffix={stat.suffix} /> {stat.text}</> : stat.label}
                </span>
              </div>
            );
          })}
        </section>
      </Reveal>

      <Reveal>
        <section className="space-y-6" aria-labelledby="how-it-works">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="purple">How it works</Badge>
            <h2 id="how-it-works" className="mt-4 text-3xl font-extrabold text-text-primary sm:text-4xl">From question to ranked answer</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <Card key={step.title} className="group overflow-hidden">
                <CardHeader>
                  <div className="mb-4 flex size-14 items-center justify-center rounded-card border border-border bg-secondary text-2xl transition-transform duration-300 group-hover:-translate-y-1">
                    {step.icon}
                  </div>
                  <CardTitle>{index + 1}. {step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </Reveal>



      <Reveal>
        <section className="space-y-6" aria-labelledby="category-grid">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl space-y-3">
              <Badge variant="amber">Categories</Badge>
              <h2 id="category-grid" className="text-3xl font-extrabold text-text-primary sm:text-4xl">Browse every ranked category</h2>
              <p className="text-base leading-7 text-text-secondary">Start with a market, then drill into transparent rankings by country, budget, and update frequency.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="overflow-hidden rounded-card border border-border bg-surface py-4 shadow-surface" aria-label="Live updates ticker">
          <div className="flex w-max gap-3 animate-ticker hover:[animation-play-state:paused]">
            {tickerItems.map((item, index) => (
              <div key={`${item}-${index}`} className="mx-1 shrink-0 rounded-pill border border-border bg-background px-5 py-3 text-sm font-semibold text-text-primary">
                {item}
              </div>
            ))}
          </div>
        </section>
      </Reveal>
    </PageWrapper>
  );
};

export default Index;
