import { PageWrapper } from "@/components/rankfinal/layout";
import { Badge } from "@/components/rankfinal/ui";

interface PlaceholderPageProps {
  title: string;
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <PageWrapper className="min-h-[60vh] py-16">
      <div className="max-w-2xl space-y-4">
        <Badge variant="gray">Placeholder route</Badge>
        <h1 className="text-4xl font-extrabold text-text-primary">{title}</h1>
        <p className="text-lg leading-8 text-text-secondary">This route is wired and ready for page content.</p>
      </div>
    </PageWrapper>
  );
}
