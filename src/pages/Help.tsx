import { Link } from "react-router-dom";
import { ArrowRight, MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/rankfinal/ui";
import { PageWrapper } from "@/components/rankfinal/layout";
import { featuredArticles, helpCategories } from "@/data/helpArticles";

export default function Help() {
  return (
    <PageWrapper className="space-y-14 py-10 lg:py-16">
      <section className="mx-auto max-w-4xl space-y-6 text-center">
        <Badge variant="amber">Help center</Badge>
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-6xl">How can we help?</h1>
          <p className="text-lg text-text-secondary">Find answers about rankings, scores, sources, billing, alerts, and support.</p>
        </div>
        <label className="mx-auto flex h-14 w-full max-w-2xl items-center gap-3 rounded-card border border-border bg-surface px-5 shadow-surface transition-all focus-within:border-accent-amber focus-within:shadow-amber">
          <Search className="size-5 text-accent-amber" aria-hidden="true" />
          <input className="h-full flex-1 bg-transparent text-base text-text-primary outline-none placeholder:text-text-secondary" placeholder="Search help articles..." type="search" />
        </label>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Help categories">
        {helpCategories.map((category) => (
          <Card key={category.title} className="group hover:-translate-y-1">
            <CardHeader>
              <div className="mb-3 flex size-12 items-center justify-center rounded-card border border-border bg-secondary text-2xl transition-transform group-hover:-translate-y-1" aria-hidden="true">{category.icon}</div>
              <CardTitle>{category.title}</CardTitle>
              <CardDescription>{category.count} articles</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]" aria-labelledby="featured-help">
        <Card>
          <CardHeader>
            <Badge variant="purple">Featured articles</Badge>
            <CardTitle id="featured-help" className="text-3xl">Start here</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {featuredArticles.map((article) => (
              <Link key={`${article.slug}-${article.title}`} to={`/help/${article.slug}`} className="group flex items-center justify-between gap-4 py-4 text-sm font-bold text-text-primary transition-colors hover:text-accent-amber">
                <span>{article.title}</span>
                <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border-accent-amber/50">
          <CardHeader>
            <div className="flex size-12 items-center justify-center rounded-card bg-accent-amber/15 text-accent-amber"><MessageSquare className="size-6" /></div>
            <CardTitle>Contact support</CardTitle>
            <CardDescription>Real help from the RankFinal team.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-text-secondary">
            <p><span className="font-bold text-text-primary">Response time:</span> &lt; 24 hours (Pro: &lt; 4 hours)</p>
            <Button asChild variant="amber" size="pill"><Link to="/contact">Send us a message <ArrowRight className="size-4" aria-hidden="true" /></Link></Button>
          </CardContent>
        </Card>
      </section>
    </PageWrapper>
  );
}
