import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Shield, Zap, Globe, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, SearchBar } from "@/components/rankfinal/ui";
import { PageWrapper } from "@/components/rankfinal/layout";

const TYPEWRITER_PHRASES = [
  "best smartphone for you.",
  "best car insurance for you.",
  "best electricity provider for you.",
  "best electric car for you.",
  "best bank for you.",
  "best travel insurance for you.",
  "best laptop for you.",
  "best home insurance for you.",
];

const TRENDING = [
  "Best EV 2026",
  "Cheapest electricity UK",
  "Top smartphone",
  "Best travel insurance",
  "Home loan Norway",
];

const TRUST_STATS = [
  { icon: <Globe className="size-5" />, label: "50+ countries" },
  { icon: <Shield className="size-5" />, label: "10 000+ verified tests" },
  { icon: <Zap className="size-5" />, label: "No sponsored content" },
  { icon: <RefreshCw className="size-5" />, label: "Updated daily" },
  { icon: <Search className="size-5" />, label: "100% independent" },
];

const TICKER_ITEMS = [
  "🔄 Updated 2h ago: Best EV insurance Norway",
  "🔄 Updated 4h ago: Best home insurance UK",
  "🔄 Updated 1h ago: Best smartphone under €800",
  "🔄 Updated 3h ago: Best electricity provider Germany",
  "🔄 Updated 5h ago: Best bank Norway 2026",
  "🔄 Updated 2h ago: Best travel insurance Europe",
];

function TypewriterText() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = TYPEWRITER_PHRASES[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < phrase.length) {
      timeout = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === phrase.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setPhraseIndex((i) => (i + 1) % TYPEWRITER_PHRASES.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, phraseIndex]);

  return (
    <span className="text-accent-amber">
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
}

export default function Index() {
  const navigate = useNavigate();

  function handleSearch(query: string) {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}&country=NO`);
    }
  }

  return (
    <PageWrapper className="space-y-0">

      {/* Hero */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center space-y-8 py-16 text-center">
        <Badge variant="amber">RankFinal.com</Badge>

        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
          Find the best{" "}
          <TypewriterText />
        </h1>

        <p className="max-w-xl text-lg font-medium text-text-secondary">
          One answer. Verified sources. No noise.
        </p>

        <div className="w-full max-w-2xl">
          <SearchBar
            containerClassName="h-14"
            onSearch={handleSearch}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {TRENDING.map((term) => (
            <button
              key={term}
              onClick={() => handleSearch(term)}
              className="rounded-pill border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-secondary transition-all hover:border-accent-amber hover:text-accent-amber"
            >
              {term}
            </button>
          ))}
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-border bg-surface py-4">
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-6 px-4">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="flex items-center gap-2 text-sm font-bold text-text-secondary">
              <span className="text-accent-amber">{stat.icon}</span>
              {stat.label}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <PageWrapper className="space-y-10">
          <div className="text-center space-y-3">
            <Badge variant="purple">How it works</Badge>
            <h2 className="text-3xl font-extrabold text-text-primary">
              From question to ranked answer
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1. Ask",
                desc: "Type what you need in plain language",
                icon: "🔍",
              },
              {
                step: "2. Analyze",
                desc: "AI scans verified tests from 50+ countries, removes bias and sponsored content",
                icon: "🧠",
              },
              {
                step: "3. Decide",
                desc: "One clear recommendation, full source transparency",
                icon: "✅",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-card border border-border bg-surface p-6 text-center space-y-3"
              >
                <div className="text-4xl">{item.icon}</div>
                <h3 className="text-lg font-extrabold text-text-primary">{item.step}</h3>
                <p className="text-sm text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </PageWrapper>
      </section>

      {/* Live updates ticker */}
      <section className="overflow-hidden border-y border-border bg-surface py-3">
        <div className="flex animate-marquee gap-8 whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="text-sm font-semibold text-text-secondary">
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <PageWrapper className="space-y-6">
          <h2 className="text-3xl font-extrabold text-text-primary">
            Ready to find the right product?
          </h2>
          <p className="text-text-secondary">
            Join thousands making smarter purchase decisions with RankFinal.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="amber" size="lg" onClick={() => navigate("/browse")}>
              Browse all categories →
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate("/pricing")}>
              See pricing
            </Button>
          </div>
        </PageWrapper>
      </section>

    </PageWrapper>
  );
}
