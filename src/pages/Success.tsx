import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageWrapper } from "@/components/rankfinal/layout";

export default function Success() {
  return (
    <PageWrapper className="flex min-h-[70vh] items-center justify-center py-16">
      <Card className="relative w-full max-w-2xl overflow-hidden border-success/30 text-center shadow-surface">
        <div className="absolute inset-x-0 top-0 h-2 bg-success" />
        <CardContent className="space-y-6 p-8 sm:p-12">
          <div className="mx-auto flex size-24 items-center justify-center rounded-pill bg-success/15 text-success">
            <Check className="size-14" aria-hidden="true" />
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold text-text-primary">Welcome to RankFinal Pro!</h1>
            <p className="text-lg font-bold text-text-primary">Your subscription is now active.</p>
            <p className="text-text-secondary">You now have unlimited searches.</p>
          </div>
          <Button asChild variant="amber" size="lg">
            <Link to="/">Start searching <ArrowRight className="size-4" aria-hidden="true" /></Link>
          </Button>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
