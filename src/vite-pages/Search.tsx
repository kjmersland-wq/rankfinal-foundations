import { Component, type ReactNode, useCallback, useEffect, useState } from "react";
import { Check, Copy, ExternalLink, Facebook, Link2, Printer, RotateCcw, Share2, ThumbsDown, ThumbsUp, Twitter, X, Zap } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, ScoreBar, SearchBar } from "@/components/rankfinal/ui";
import { PageWrapper } from "@/components/rankfinal/layout";
import { getRankFinalRecommendation, type RankFinalResult } from "@/lib/rankfinal-ai";

const FREE_SEARCH_LIMIT = 5;
const FREE_SEARCH_USAGE_KEY = "rankfinal_free_search_usage";
const FEEDBACK_KEY = "rankfinal_feedback";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function recordFreeSearch() {
  try {
    const today = todayKey();
    const stored = JSON.parse(localStorage.getItem(FREE_SEARCH_USAGE_KEY) || "{}") as { date?: string; count?: number };
    const count = stored.date === today ? (stored.count ?? 0) + 1 : 1;
    localStorage.setItem(FREE_SEARCH_USAGE_KEY, JSON.stringify({ date: today, count }));
    return count;
  } catch {
    return 1;
  }
}

function saveFeedback(query: string, rating: "up" | "down", comment: string) {
  try {
    const existing = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || "[]") as object[];
    existing.push({ query, rating, comment, date: new Date().toISOString() });
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error("Failed to save feedback to localStorage:", error);
  }
}

async function sendFeedbackEmail(query: string, rating: "up" | "down", comment: string, result: RankFinalResult) {
  try {
    await fetch("https://formspree.io/f/kjmersland@gmail.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: `RankFinal Feedback: ${rating === "up" ? "👍" : "👎"} – ${query}`,
        query,
        rating: rating === "up" ? "👍 Helpful" : "👎 Not helpful",
        comment: comment || "No comment",
        best_recommendation: result.best.name,
        country: result.country,
        date: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error("Failed to send feedback email:", error);
  }
}

function UpgradeBanner() {
  return (
    <PageWrapper className="pt-5">
      <div className="flex flex-col gap-3 rounded-card border border-accent-amber/40 bg-accent-amber/15 p-4 shadow-amber sm:flex-row sm:items-center sm:justify-between">
        <p className="font-bold text-text-primary">You've used your 5 free searches today. Upgrade to Pro for unlimited access.</p>
        <Button asChild variant="amber" className="shrink-0">
          <Link to="/pricing">Upgrade to Pro €9/month →</Link>
        </Button>
      </div>
    </PageWrapper>
  );
}

function getCountryFlag(country: string) {
  const code = country.trim().slice(0, 2).toUpperCase();
  const flags: Record<string, string> = {
    NO: "🇳🇴", UK: "🇬🇧", GB: "🇬🇧", US: "🇺🇸",
    DE: "🇩🇪", FR: "🇫🇷", SE: "🇸🇪", DK: "🇩🇰", EU: "🇪🇺",
  };
  return flags[code] ?? "🌐";
}

function ShareButtons({ result }: { result: RankFinalResult }) {
  const [copied, setCopied] = useState(false);
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(
    `🥇 Best choice for "${result.query}": ${result.best.name} (${result.best.score.toFixed(1)}/10) – via RankFinal.com`
  );

  const shareLinks = [
    {
      name: "Facebook",
      icon: <Facebook className="size-4" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      color: "hover:bg-blue-600 hover:border-blue-600 hover:text-white",
    },
    {
      name: "X / Twitter",
      icon: <Twitter className="size-4" />,
      href: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      color: "hover:bg-black hover:border-black hover:text-white",
    },
    {
      name: "LinkedIn",
      icon: (
        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      color: "hover:bg-blue-700 hover:border-blue-700 hover:text-white",
    },
    {
      name: "WhatsApp",
      icon: (
        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      href: `https://wa.me/?text=${text}%20${url}`,
      color: "hover:bg-green-500 hover:border-green-500 hover:text-white",
    },
  ];

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1 text-sm font-bold text-text-secondary">
        <Share2 className="size-4" /> Share:
      </span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          title={`Share on ${link.name}`}
          className={`inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface px-3 py-1.5 text-xs font-bold text-text-secondary transition-all ${link.color}`}
        >
          {link.icon}
          <span className="hidden sm:inline">{link.name}</span>
        </a>
      ))}
      <button
        onClick={copyLink}
        title="Copy link"
        className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface px-3 py-1.5 text-xs font-bold text-text-secondary transition-all hover:border-accent-amber hover:text-accent-amber"
      >
        {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
        <span className="hidden sm:inline">{copied ? "Copied!" : "Copy link"}</span>
      </button>
    </div>
  );
}

function FeedbackWidget({ result }: { result: RankFinalResult }) {
  const [rating, setRating] = useState<"up" | "down" | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit() {
    if (!rating) return;
    setSending(true);
    saveFeedback(result.query, rating, comment);
    await sendFeedbackEmail(result.query, rating, comment, result);
    setSending(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card className="border-success/30 bg-success/5">
        <CardContent className="flex items-center gap-3 py-4">
          <Check className="size-5 text-success" />
          <p className="font-bold text-text-primary">Thank you for your feedback! It helps us improve RankFinal.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Was this recommendation helpful?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <button
            onClick={() => setRating("up")}
            className={`inline-flex items-center gap-2 rounded-pill border px-4 py-2 text-sm font-bold transition-all ${
              rating === "up"
                ? "border-success bg-success/15 text-success"
                : "border-border bg-surface text-text-secondary hover:border-success hover:text-success"
            }`}
          >
            <ThumbsUp className="size-4" /> Yes, helpful
          </button>
          <button
            onClick={() => setRating("down")}
            className={`inline-flex items-center gap-2 rounded-pill border px-4 py-2 text-sm font-bold transition-all ${
              rating === "down"
                ? "border-destructive bg-destructive/15 text-destructive"
                : "border-border bg-surface text-text-secondary hover:border-destructive hover:text-destructive"
            }`}
          >
            <ThumbsDown className="size-4" /> Not helpful
          </button>
        </div>

        {rating && (
          <div className="space-y-3 animate-fade-in">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                rating === "up"
                  ? "What did you like about this recommendation? (optional)"
                  : "What was wrong or missing? Help us improve. (optional)"
              }
              rows={3}
              className="w-full rounded-input border border-border bg-background px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent-amber focus:outline-none resize-none"
            />
            <Button variant="amber" onClick={handleSubmit} disabled={sending} className="w-full sm:w-auto">
              {sending ? "Sending..." : "Send feedback →"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LoadingResults({ step }: { step: 1 | 2 }) {
  const message =
    step === 1
      ? "Step 1/2: Searching verified sources worldwide..."
      : "Step 2/2: Analyzing and ranking results...";

  return (
    <PageWrapper className="flex min-h-[60vh] items-center justify-center py-16">
      <div className="mx-auto w-full max-w-xl space-y-6 text-center">
        <div className="mx-auto flex size-16 animate-pulse items-center justify-center rounded-pill bg-accent-amber/15 text-accent-amber shadow-amber">
          <Zap className="size-8" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-extrabold text-text-primary sm:text-4xl">{message}</h1>
        <div className="h-1.5 overflow-hidden rounded-pill bg-surface shadow-surface">
          <div className="h-full w-1/2 animate-pulse rounded-pill bg-accent-amber shadow-amber" />
        </div>
        <p className="text-sm text-text-secondary">This usually takes 10–20 seconds</p>
      </div>
    </PageWrapper>
  );
}

function EmptySearch() {
  return (
    <PageWrapper className="min-h-[60vh] py-16">
      <div className="mx-auto max-w-3xl space-y-5 text-center">
        <Badge variant="amber">Search RankFinal</Badge>
        <h1 className="text-4xl font-extrabold text-text-primary">What should we rank for you?</h1>
        <SearchBar containerClassName="mx-auto h-14 max-w-none" />
      </div>
    </PageWrapper>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <PageWrapper className="min-h-[60vh] py-16">
      <Card className="mx-auto max-w-2xl border-l-4 border-l-destructive">
        <CardHeader>
          <Badge variant="red">Recommendation unavailable</Badge>
          <CardTitle>Unable to load recommendation. Please try again.</CardTitle>
          <CardDescription>The verified-source scan could not be completed right now.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="amber" onClick={onRetry}>
            <RotateCcw className="size-4" /> Retry
          </Button>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}

function ScoreBreakdown({ result }: { result: RankFinalResult }) {
  return (
    <Card className="print-section">
      <CardHeader><CardTitle>Score breakdown</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="text-text-secondary">
            <tr className="border-b border-border">
              <th className="py-3">Criteria</th>
              <th>Score</th>
              <th>Weight</th>
              <th>Bar</th>
            </tr>
          </thead>
          <tbody>
            {result.score_breakdown.map((row) => (
              <tr key={row.criteria} className="border-b border-border">
                <td className="py-4 font-bold text-text-primary">{row.criteria}</td>
                <td className="font-bold text-text-primary">{row.score.toFixed(1)}/10</td>
                <td className="text-text-secondary">{row.weight}%</td>
                <td className="w-56"><ScoreBar score={row.score} label="" /></td>
              </tr>
            ))}
            <tr>
              <td className="py-4 text-lg font-extrabold text-accent-amber">FINAL SCORE</td>
              <td className="text-lg font-extrabold text-accent-amber">{result.best.score.toFixed(1)}/10</td>
              <td /><td />
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function Sources({ result }: { result: RankFinalResult }) {
  return (
    <Card className="print-section sources-section">
      <CardHeader>
        <CardTitle>Verified Sources</CardTitle>
        <CardDescription>All sources are independent. RankFinal receives no payment from any reviewed brand.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        {result.sources.map((source) => (
          <article key={`${source.name}-${source.url}`} className="rounded-card border border-border bg-background p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-extrabold text-text-primary">{source.name}</h3>
              <span className="shrink-0 text-sm text-text-secondary">
                {getCountryFlag(source.country)} {source.country}
              </span>
            </div>
            <p className="mt-2 text-xs font-bold uppercase tracking-wide text-text-secondary">
              {source.date} · {"★".repeat(Math.max(1, Math.min(5, Math.round(source.credibility))))}
            </p>
            <p className="mt-3 text-sm leading-6 text-text-secondary">{source.description}</p>
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-accent-amber"
            >
              → View source <ExternalLink className="size-4" />
            </a>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

function Results({ result }: { result: RankFinalResult }) {
  return (
    <PageWrapper className="space-y-6 py-8 print:max-w-none print:p-0">
      <section className="filters rounded-card border border-border bg-surface p-4 shadow-surface">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold text-text-secondary">Verified recommendation for</p>
            <h1 className="text-2xl font-extrabold text-text-primary sm:text-3xl">{result.query}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="gray">Country: {result.country}</Badge>
            <span className="inline-flex items-center gap-2 rounded-pill border border-border bg-background px-3 py-1 text-xs font-bold text-text-primary">
              <span className="size-2 rounded-pill bg-success" /> Analysis complete
            </span>
            <Button variant="secondary" onClick={() => window.print()}>
              <Printer className="size-4" /> Print
            </Button>
          </div>
        </div>
      </section>

      <section className="print:hidden">
        <ShareButtons result={result} />
      </section>

      <section className="space-y-6 animate-fade-in">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
          <Card className="print-section border-l-4 border-l-accent-amber shadow-amber">
            <CardHeader>
              <Badge variant="amber">🥇 Best choice</Badge>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <CardTitle className="text-3xl">{result.best.name}</CardTitle>
                <span className="rounded-pill bg-accent-amber px-3 py-1 text-sm font-extrabold text-primary-foreground">
                  {result.best.score.toFixed(1)} / 10
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ScoreBar score={result.best.score} />
              <p className="text-base leading-8 text-text-primary">{result.best.reason}</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="font-bold text-success">✓ Strengths</h3>
                  {result.best.strengths.map((strength) => (
                    <p key={strength} className="flex gap-2 text-sm text-text-secondary">
                      <Check className="mt-0.5 size-4 shrink-0 text-success" />{strength}
                    </p>
                  ))}
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-destructive">✗ Weaknesses</h3>
                  {result.best.weaknesses.map((weakness) => (
                    <p key={weakness} className="flex gap-2 text-sm text-text-secondary">
                      <X className="mt-0.5 size-4 shrink-0 text-destructive" />{weakness}
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="rounded-pill border border-border bg-background px-4 py-2 text-xl font-extrabold text-text-primary">
                  {result.best.price_range}
                </span>
                <Button variant="amber">
                  Check current price <ExternalLink className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-l-4 border-l-accent-purple">
              <CardHeader>
                <Badge variant="purple">🥈 Alternative</Badge>
                <CardTitle>{result.alternative.name} · {result.alternative.score.toFixed(1)}/10</CardTitle>
                <CardDescription>{result.alternative.reason}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="rounded-input bg-background p-3 text-sm font-semibold italic text-text-primary">
                  Choose this if: {result.alternative.good_if}
                </p>
                <span className="font-extrabold text-text-primary">{result.alternative.price_range}</span>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-destructive">
              <CardHeader>
                <Badge variant="red">❌ Avoid</Badge>
                <CardTitle>{result.avoid.name}</CardTitle>
                <CardDescription>{result.avoid.reason}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        <ScoreBreakdown result={result} />
        <Sources result={result} />

        <section className="print:hidden">
          <FeedbackWidget result={result} />
        </section>

        <section className="print:hidden rounded-card border border-border bg-surface p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold text-text-primary">Found this useful?</p>
              <p className="text-sm text-text-secondary">Share this recommendation with someone who needs it.</p>
            </div>
            <ShareButtons result={result} />
          </div>
        </section>
      </section>
    </PageWrapper>
  );
}

class SearchErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Search page render failed", error);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorState onRetry={() => window.location.reload()} />;
    }
    return this.props.children;
  }
}

function SearchPageContent() {
  const [params] = useSearchParams();
  const query = params.get("q") ?? "";
  const country = params.get("country") ?? "Global";
  const [result, setResult] = useState<RankFinalResult | null>(null);
  const [loading, setLoading] = useState(Boolean(query));
  const [loadingStep, setLoadingStep] = useState<1 | 2>(1);
  const [error, setError] = useState(false);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);

  const loadRecommendation = useCallback(async () => {
    if (!query) return;
    setLoading(true);
    setLoadingStep(1);
    setError(false);
    setResult(null);

    try {
      const usageCount = recordFreeSearch();
      setShowUpgradeBanner(usageCount >= FREE_SEARCH_LIMIT);
      const recommendation = await getRankFinalRecommendation(query, country);
      setResult(recommendation);
    } catch (loadError) {
      console.error("RankFinal recommendation failed", loadError);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [country, query]);

  useEffect(() => { void loadRecommendation(); }, [loadRecommendation]);

  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => setLoadingStep(2), 4500);
    return () => window.clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    if (!query) return;
    const titleQuery = query.trim().split(" ").filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    document.title = `${titleQuery} 2026 – RankFinal Analysis`;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = `Independent AI analysis of ${query.trim()} in ${country.trim() || "Global"}. Verified sources, honest strengths and weaknesses. Updated 2026.`;
  }, [country, query]);

  if (!query) return <EmptySearch />;
  if (loading) return (
    <>{showUpgradeBanner && <UpgradeBanner />}<LoadingResults step={loadingStep} /></>
  );
  if (error || !result) return (
    <>{showUpgradeBanner && <UpgradeBanner />}<ErrorState onRetry={loadRecommendation} /></>
  );
  return (
    <>{showUpgradeBanner && <UpgradeBanner />}<Results result={result} /></>
  );
}

export default function SearchPage() {
  return (
    <SearchErrorBoundary>
      <SearchPageContent />
    </SearchErrorBoundary>
  );
}
