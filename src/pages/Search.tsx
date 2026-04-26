import { Component, type ReactNode, useCallback, useEffect, useState } from "react";
import { Check, ExternalLink, Printer, RotateCcw, X, Zap } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, ScoreBar, SearchBar } from "@/components/rankfinal/ui";
import { PageWrapper } from "@/components/rankfinal/layout";
import { getRankFinalRecommendation, type RankFinalResult } from "@/lib/rankfinal-ai";

function getCountryFlag(country: string) {
  const code = country.trim().slice(0, 2).toUpperCase();
  const flags: Record<string, string> = {
    NO: "🇳🇴",
    UK: "🇬🇧",
    GB: "🇬🇧",
    US: "🇺🇸",
    DE: "🇩🇪",
    FR: "🇫🇷",
    SE: "🇸🇪",
    DK: "🇩🇰",
    EU: "🇪🇺",
  };
  return flags[code] ?? "🌐";
}

function LoadingResults() {
  return (
    <PageWrapper className="flex min-h-[60vh] items-center justify-center py-16">
      <div className="mx-auto w-full max-w-xl space-y-6 text-center">
        <div className="mx-auto flex size-16 animate-pulse items-center justify-center rounded-pill bg-accent-amber/15 text-accent-amber shadow-amber">
          <Zap className="size-8" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-extrabold text-text-primary sm:text-4xl">Scanning verified sources worldwide...</h1>
        <div className="h-1.5 overflow-hidden rounded-pill bg-surface shadow-surface">
          <div className="h-full w-1/2 animate-pulse rounded-pill bg-accent-amber shadow-amber" />
        </div>
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
      <CardHeader>
        <CardTitle>Score breakdown</CardTitle>
      </CardHeader>
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
              <td />
              <td />
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
              <span className="shrink-0 text-sm text-text-secondary">{getCountryFlag(source.country)} {source.country}</span>
            </div>
            <p className="mt-2 text-xs font-bold uppercase tracking-wide text-text-secondary">{source.date} · {"★".repeat(Math.max(1, Math.min(5, Math.round(source.credibility))))}</p>
            <p className="mt-3 text-sm leading-6 text-text-secondary">{source.description}</p>
            <a href={source.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-accent-amber">
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
            <span className="inline-flex items-center gap-2 rounded-pill border border-border bg-background px-3 py-1 text-xs font-bold text-text-primary"><span className="size-2 rounded-pill bg-success" /> Analysis complete</span>
            <Button variant="secondary" onClick={() => window.print()}>
              <Printer className="size-4" /> Print
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-6 animate-fade-in">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
          <Card className="print-section border-l-4 border-l-accent-amber shadow-amber">
            <CardHeader>
              <Badge variant="amber">🥇 Best choice</Badge>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <CardTitle className="text-3xl">{result.best.name}</CardTitle>
                <span className="rounded-pill bg-accent-amber px-3 py-1 text-sm font-extrabold text-primary-foreground">{result.best.score.toFixed(1)} / 10</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ScoreBar score={result.best.score} />
              <p className="text-base leading-8 text-text-primary">{result.best.reason}</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="font-bold text-success">✓ Strengths</h3>
                  {result.best.strengths.map((strength) => (
                    <p key={strength} className="flex gap-2 text-sm text-text-secondary"><Check className="mt-0.5 size-4 shrink-0 text-success" />{strength}</p>
                  ))}
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-destructive">✗ Weaknesses</h3>
                  {result.best.weaknesses.map((weakness) => (
                    <p key={weakness} className="flex gap-2 text-sm text-text-secondary"><X className="mt-0.5 size-4 shrink-0 text-destructive" />{weakness}</p>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="rounded-pill border border-border bg-background px-4 py-2 text-xl font-extrabold text-text-primary">{result.best.price_range}</span>
                <Button variant="amber">Check current price <ExternalLink className="size-4" /></Button>
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
                <p className="rounded-input bg-background p-3 text-sm font-semibold italic text-text-primary">Choose this if: {result.alternative.good_if}</p>
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
      </section>
    </PageWrapper>
  );
}

class SearchErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
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
  const [error, setError] = useState(false);

  const loadRecommendation = useCallback(async () => {
    if (!query) return;
    setLoading(true);
    setError(false);
    setResult(null);

    try {
      const recommendation = await getRankFinalRecommendation(query, country);
      setResult(recommendation);
    } catch (loadError) {
      console.error("RankFinal recommendation failed", loadError);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [country, query]);

  useEffect(() => {
    void loadRecommendation();
  }, [loadRecommendation]);

  if (!query) return <EmptySearch />;
  if (loading) return <LoadingResults />;
  if (error || !result) return <ErrorState onRetry={loadRecommendation} />;
  return <Results result={result} />;
}

export default function SearchPage() {
  return (
    <SearchErrorBoundary>
      <SearchPageContent />
    </SearchErrorBoundary>
  );
}
