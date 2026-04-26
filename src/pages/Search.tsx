import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, ExternalLink, Heart, Printer, Share2, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, LoadingSkeleton, ScoreBar, SearchBar, UpdateBadge } from "@/components/rankfinal/ui";
import { PageWrapper } from "@/components/rankfinal/layout";
import { mockSearchResults, type SearchResultSet } from "@/data/searchResults";
import { cn } from "@/lib/utils";

const loadingMessages = ["Fetching", "Analyzing", "Scoring", "Done"];
const sortOptions = ["Relevance", "Score", "Recently Updated"];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function findResult(query: string) {
  const normalized = normalize(query);
  return mockSearchResults.find((item) => normalize(item.query) === normalized) ?? mockSearchResults.find((item) => normalized && normalize(item.query).includes(normalized));
}

function LoadingResults() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setStep((current) => Math.min(current + 1, loadingMessages.length - 1)), 420);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <PageWrapper className="space-y-6 py-10">
      <div className="space-y-3 text-center">
        <Badge variant="amber">🔍 Scanning verified sources worldwide...</Badge>
        <div className="flex flex-wrap justify-center gap-2">
          {loadingMessages.map((message, index) => <span key={message} className={cn("rounded-pill border px-3 py-1 text-xs font-bold", index <= step ? "border-accent-amber bg-accent-amber/15 text-accent-amber" : "border-border text-text-secondary")}>{message}</span>)}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <LoadingSkeleton className="h-96 rounded-card" />
        <div className="space-y-4"><LoadingSkeleton className="h-44 rounded-card" /><LoadingSkeleton className="h-44 rounded-card" /></div>
      </div>
      <LoadingSkeleton className="h-80 rounded-card" />
    </PageWrapper>
  );
}

function EmptyState({ query }: { query: string }) {
  const related = mockSearchResults.slice(0, 3);
  return (
    <PageWrapper className="min-h-[60vh] py-16">
      <Card>
        <CardHeader>
          <Badge variant="gray">No analysis yet</Badge>
          <CardTitle className="text-3xl">We haven't analyzed this yet.</CardTitle>
          <CardDescription>Request “{query || "this category"}” and RankFinal will prioritize verified sources for it.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button variant="amber">Request this category</Button>
          <div className="grid gap-3 md:grid-cols-3">
            {related.map((item) => <a key={item.query} href={`/search?q=${encodeURIComponent(item.query)}&country=${item.country}`} className="rounded-card border border-border bg-background p-4 text-sm font-bold text-text-primary transition-colors hover:border-accent-amber">{item.query}</a>)}
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}

function ResultActions() {
  return (
    <div className="share-actions flex flex-wrap gap-2 text-sm font-semibold text-text-secondary">
      <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-pill border border-border px-3 py-2 hover:text-text-primary"><Printer className="size-4" /> Print</button>
      <button className="inline-flex items-center gap-2 rounded-pill border border-border px-3 py-2 hover:text-text-primary"><Share2 className="size-4" /> Share</button>
      <button className="inline-flex items-center gap-2 rounded-pill border border-border px-3 py-2 hover:text-text-primary"><Heart className="size-4" /> Save</button>
    </div>
  );
}

function ScoringTable({ result }: { result: SearchResultSet }) {
  return (
    <Card className="print-section">
      <CardHeader><CardTitle>Scoring breakdown</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="text-text-secondary"><tr className="border-b border-border"><th className="py-3">Criteria</th><th>Score</th><th>Weight</th><th>Bar</th></tr></thead>
          <tbody>
            {result.scores.map((row) => <tr key={row.criteria} className="border-b border-border"><td className="py-4 font-bold text-text-primary">{row.criteria}</td><td className="font-bold text-text-primary">{row.score.toFixed(1)}/10</td><td className="text-text-secondary">{row.weight}</td><td className="w-56"><ScoreBar score={row.score} label="" /></td></tr>)}
            <tr><td className="py-4 text-lg font-extrabold text-accent-amber">FINAL SCORE</td><td className="text-lg font-extrabold text-accent-amber">{result.bestChoice.score.toFixed(1)}/10</td><td /><td /></tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function Sources({ result }: { result: SearchResultSet }) {
  const [showAll, setShowAll] = useState(false);
  const visibleSources = showAll ? result.sources : result.sources.slice(0, 3);
  return (
    <Card className="print-section sources-section">
      <CardHeader><CardTitle>Verified sources</CardTitle><CardDescription>All sources are independent. RankFinal receives no payment from reviewed brands.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        {visibleSources.map((source) => <div key={source.name} className="rounded-card border border-border bg-background p-4"><div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><h3 className="font-extrabold text-text-primary">{source.name}</h3><span className="text-sm text-text-secondary">{source.flag} {source.country} · {source.date} · {"★".repeat(source.stars)}</span></div><p className="mt-2 text-sm leading-6 text-text-secondary">{source.description}</p><a href={source.url} className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-accent-amber">View source <ExternalLink className="size-4" /></a></div>)}
        <button className="share-actions text-sm font-bold text-accent-amber" onClick={() => setShowAll((open) => !open)}>Show {showAll ? "fewer" : `all ${result.sourceCount} sources`}</button>
      </CardContent>
    </Card>
  );
}

function Results({ result, query }: { result: SearchResultSet; query: string }) {
  const [sort, setSort] = useState(sortOptions[0]);
  const today = new Date().toLocaleDateString();
  return (
    <PageWrapper className="space-y-6 py-8 print:max-w-none print:p-0">
      <div className="print-header hidden"><strong>RankFinal.com</strong> · {today} · Query: {query}</div>
      <section className="filters rounded-card border border-border bg-surface p-4 shadow-surface">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div><p className="text-sm font-bold text-text-secondary">Search results for</p><h1 className="text-2xl font-extrabold text-text-primary sm:text-3xl">{query}</h1></div>
          <div className="flex flex-wrap items-center gap-2"><Badge variant="gray">Country: {result.country}</Badge><Badge variant="gray">Budget: Mid-range</Badge><Badge variant="purple">{result.category}</Badge><Badge variant="amber">Year: {result.year}</Badge><UpdateBadge hours={2} /></div>
          <label className="flex items-center gap-2 rounded-input border border-border bg-background px-3 py-2 text-sm font-bold text-text-primary">Sort <select value={sort} onChange={(event) => setSort(event.target.value)} className="bg-transparent outline-none"><option>{sortOptions[0]}</option><option>{sortOptions[1]}</option><option>{sortOptions[2]}</option></select><ChevronDown className="size-4" /></label>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
        <Card className="print-section border-l-4 border-l-accent-amber shadow-amber">
          <CardHeader><Badge variant="amber">🥇 Best choice</Badge><CardTitle className="text-3xl">{result.bestChoice.name}</CardTitle></CardHeader>
          <CardContent className="space-y-6"><ScoreBar score={result.bestChoice.score} /><p className="text-base leading-8 text-text-primary">{result.bestChoice.recommendation}</p><div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><h3 className="font-bold text-text-primary">Strengths</h3>{result.bestChoice.strengths.map((item) => <p key={item} className="flex gap-2 text-sm text-text-secondary"><Check className="mt-0.5 size-4 shrink-0 text-success" />{item}</p>)}</div><div className="space-y-2"><h3 className="font-bold text-text-primary">Weaknesses</h3>{result.bestChoice.weaknesses.map((item) => <p key={item} className="flex gap-2 text-sm text-text-secondary"><X className="mt-0.5 size-4 shrink-0 text-destructive" />{item}</p>)}</div></div><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><span className="text-xl font-extrabold text-text-primary">{result.bestChoice.price}</span><Button variant="amber">Check current price <ExternalLink className="size-4" /></Button></div><ResultActions /></CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-l-4 border-l-accent-purple"><CardHeader><Badge variant="purple">🥈 Best alternative</Badge><CardTitle>{result.alternative.name} · {result.alternative.score.toFixed(1)}/10</CardTitle><CardDescription>{result.alternative.reason}</CardDescription></CardHeader><CardContent className="space-y-4"><p className="rounded-input bg-background p-3 text-sm font-semibold text-text-primary">Choose this if: {result.alternative.scenario}</p><div className="flex items-center justify-between gap-3"><span className="font-extrabold text-text-primary">{result.alternative.price}</span><Button variant="secondary" size="sm">View offer</Button></div></CardContent></Card>
          <Card className="border-l-4 border-l-destructive"><CardHeader><Badge variant="red">❌ What to avoid</Badge><CardTitle>{result.avoid.name}</CardTitle><CardDescription>{result.avoid.reason}</CardDescription></CardHeader></Card>
        </div>
      </div>

      <ScoringTable result={result} />
      <Sources result={result} />
    </PageWrapper>
  );
}

export default function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get("q") ?? "";
  const [loading, setLoading] = useState(Boolean(query));
  const result = useMemo(() => findResult(query), [query]);

  useEffect(() => {
    setLoading(Boolean(query));
    const timeout = window.setTimeout(() => setLoading(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [query]);

  if (!query) return <PageWrapper className="min-h-[60vh] py-16"><div className="mx-auto max-w-3xl space-y-5 text-center"><Badge variant="amber">Search RankFinal</Badge><h1 className="text-4xl font-extrabold text-text-primary">What should we rank for you?</h1><SearchBar containerClassName="mx-auto h-14 max-w-none" /></div></PageWrapper>;
  if (loading) return <LoadingResults />;
  if (!result) return <EmptyState query={query} />;
  return <Results result={result} query={query} />;
}
