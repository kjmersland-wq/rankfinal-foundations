import { Mail, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/rankfinal/ui";
import { PageWrapper } from "@/components/rankfinal/layout";

const steps = [
  ["1", "Collect", "Our AI collects independent test data from verified global sources across 50+ countries."],
  ["2", "Clean", "It removes bias, sponsored content, and fake reviews while weighting quality of testing — not quantity of reviews."],
  ["3", "Recommend", "RankFinal delivers one recommendation with full source transparency. You see exactly why we picked it."],
];

const principles = [
  ["🎯", "Independence", "We never accept payment to recommend products."],
  ["🔍", "Transparency", "Every recommendation shows its sources."],
  ["✋", "Honesty", "We show weaknesses, not just strengths."],
  ["⚡", "Accuracy", "Results updated continuously from live sources."],
];

const methodology = [
  "Must be fully independent (no manufacturer funding)",
  "Must have documented, repeatable test methodology",
  "Must be publicly accessible and verifiable",
  "Credibility weighted by: recency, test depth, independence score, geographic coverage",
];

export default function About() {
  return (
    <PageWrapper className="space-y-16 py-10 lg:py-16">
      <section className="relative overflow-hidden rounded-card border border-border bg-surface px-6 py-16 text-center shadow-surface sm:px-10 lg:py-24">
        <div className="absolute inset-x-10 top-0 h-48 rounded-pill bg-accent-amber/20 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl space-y-5">
          <Badge variant="amber">About RankFinal</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-6xl">We built the tool we always wanted.</h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-text-secondary">RankFinal exists because honest, clear purchase decisions are hard to find.</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl space-y-5 text-center">
        <Badge variant="red">The problem</Badge>
        <p className="text-2xl font-bold leading-10 text-text-primary">The internet is full of paid reviews, SEO articles, and influencer recommendations. You can't trust them. Google is full of noise. Review sites are compromised by affiliate deals. Nobody gives you a straight answer. We built RankFinal to fix that.</p>
      </section>

      <section className="space-y-6" aria-labelledby="about-how-it-works">
        <div className="text-center">
          <Badge variant="purple">How it works</Badge>
          <h2 id="about-how-it-works" className="mt-4 text-3xl font-extrabold text-text-primary sm:text-4xl">A cleaner path from research to decision</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map(([number, title, text]) => (
            <Card key={title}>
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-pill bg-accent-amber text-lg font-extrabold text-primary-foreground">{number}</div>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-text-secondary">{text}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6" aria-labelledby="principles">
        <div className="text-center">
          <Badge variant="amber">Our principles</Badge>
          <h2 id="principles" className="mt-4 text-3xl font-extrabold text-text-primary sm:text-4xl">What RankFinal will not compromise</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map(([icon, title, text]) => (
            <Card key={title}>
              <CardHeader>
                <div className="text-3xl" aria-hidden="true">{icon}</div>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-text-secondary">{text}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-4">
          <Badge variant="green">Source methodology</Badge>
          <h2 className="text-3xl font-extrabold text-text-primary">How we select and verify sources</h2>
        </div>
        <Card>
          <CardContent className="space-y-4 p-6">
            {methodology.map((item) => <div key={item} className="rounded-input border border-border bg-background p-4 text-sm font-semibold leading-6 text-text-primary">{item}</div>)}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><Badge variant="gray">The company</Badge><CardTitle>Built by KM TECH LABS</CardTitle></CardHeader>
          <CardContent className="space-y-5 text-sm leading-7 text-text-secondary">
            <p>RankFinal is built and operated by KM TECH LABS, based in Kristiansand, Norway.</p>
            <p>We believe people deserve better than endless lists and paid reviews. So we built the tool we always wanted ourselves.</p>
            <div className="inline-flex items-center gap-2 rounded-pill border border-border bg-background px-4 py-2 font-bold text-text-primary"><MapPin className="size-4 text-accent-amber" /> KM TECH LABS — Kristiansand, Norway</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><Badge variant="amber">Contact</Badge><CardTitle>Reach the RankFinal team</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-text-secondary">
            <p className="flex items-center gap-3"><Mail className="size-4 text-accent-amber" /><span><strong className="text-text-primary">General:</strong> hello@rankfinal.com</span></p>
            <p className="flex items-center gap-3"><Mail className="size-4 text-accent-amber" /><span><strong className="text-text-primary">Support:</strong> support@rankfinal.com</span></p>
          </CardContent>
        </Card>
      </section>
    </PageWrapper>
  );
}
