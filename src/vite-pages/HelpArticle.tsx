import { Link, useParams } from "react-router-dom";
import { ArrowRight, ThumbsDown, ThumbsUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/rankfinal/ui";
import { PageWrapper } from "@/components/rankfinal/layout";
import { helpArticles } from "@/data/helpArticles";
import NotFound from "./NotFound";

export default function HelpArticle() {
  const { slug } = useParams();
  const article = helpArticles.find((item) => item.slug === slug);

  if (!article) return <NotFound />;

  return (
    <PageWrapper className="py-10 lg:py-16">
      <article className="mx-auto max-w-3xl space-y-8">
        <nav className="text-sm font-semibold text-text-secondary" aria-label="Breadcrumb">
          <Link to="/help" className="hover:text-accent-amber">Help</Link>
          <span className="mx-2">›</span>
          <span className="text-text-primary">{article.category}</span>
        </nav>

        <header className="space-y-5">
          <Badge variant="green">Last updated: {article.lastUpdated}</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-6xl">{article.title}</h1>
        </header>

        <Card>
          <CardContent className="space-y-8 p-6 sm:p-8">
            {article.sections.map((section) => (
              <section key={section.heading} className="space-y-3">
                <h2 className="text-2xl font-extrabold text-text-primary">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-8 text-text-secondary">{paragraph}</p>
                ))}
              </section>
            ))}
          </CardContent>
        </Card>

        <section className="space-y-4" aria-labelledby="related-articles">
          <h2 id="related-articles" className="text-2xl font-extrabold text-text-primary">Related articles</h2>
          <div className="grid gap-3">
            {article.related.map((related) => (
              <Link key={`${related.slug}-${related.title}`} to={`/help/${related.slug}`} className="group flex items-center justify-between rounded-card border border-border bg-surface p-4 text-sm font-bold text-text-primary transition-colors hover:border-accent-amber hover:text-accent-amber">
                <span>{related.title}</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </section>

        <Card>
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="font-bold text-text-primary">Was this helpful?</div>
            <div className="flex gap-2">
              <button className="rounded-pill border border-border px-4 py-2 text-sm font-bold text-text-primary transition-colors hover:border-success hover:text-success"><ThumbsUp className="mr-2 inline size-4" /> Yes</button>
              <button className="rounded-pill border border-border px-4 py-2 text-sm font-bold text-text-primary transition-colors hover:border-destructive hover:text-destructive"><ThumbsDown className="mr-2 inline size-4" /> No</button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent-amber/50">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-extrabold text-text-primary">Need more help?</h2>
              <p className="text-sm text-text-secondary">Contact support and we’ll help you find the answer.</p>
            </div>
            <Link to="/help" className="text-sm font-bold text-accent-amber hover:underline">Contact support</Link>
          </CardContent>
        </Card>
      </article>
    </PageWrapper>
  );
}
