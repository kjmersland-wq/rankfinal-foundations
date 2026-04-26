import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, CountryFlag, LoadingSkeleton, ScoreBar, UpdateBadge } from "@/components/rankfinal/ui";
import { PageWrapper } from "@/components/rankfinal/layout";

const foundationItems = ["Design tokens", "Reusable UI", "Responsive layout", "PWA shell"];

const Index = () => {
  return (
    <PageWrapper className="space-y-8">
      <section className="space-y-4 py-6">
        <Badge variant="amber">Foundation ready</Badge>
        <div className="max-w-3xl space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl">RankFinal.com</h1>
          <p className="text-lg leading-8 text-text-secondary">Project structure, design system, layout shell, routing placeholders, and reusable components are in place.</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" aria-label="Foundation checklist">
        {foundationItems.map((item) => (
          <Card key={item}>
            <CardHeader>
              <CardTitle>{item}</CardTitle>
              <CardDescription>Configured for future pages.</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2" aria-label="Component preview">
        <Card>
          <CardHeader>
            <CardTitle>Component baseline</CardTitle>
            <CardDescription>Reusable primitives styled with RankFinal tokens.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge variant="amber">Amber</Badge>
              <Badge variant="purple">Purple</Badge>
              <Badge variant="green">Green</Badge>
              <Badge variant="gray">Gray</Badge>
              <Badge variant="red">Red</Badge>
            </div>
            <ScoreBar score={8.6} />
            <CountryFlag flag="🇳🇴" country="Norway" />
            <UpdateBadge hours={2} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Loading states</CardTitle>
            <CardDescription>Dark pulsing placeholders for future data views.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <LoadingSkeleton className="h-4 w-3/4" />
            <LoadingSkeleton className="h-4 w-full" />
            <LoadingSkeleton className="h-28 w-full rounded-card" />
          </CardContent>
        </Card>
      </section>
    </PageWrapper>
  );
};

export default Index;
