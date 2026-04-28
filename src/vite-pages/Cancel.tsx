import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageWrapper } from "@/components/rankfinal/layout";

export default function Cancel() {
  return (
    <PageWrapper className="flex min-h-[60vh] items-center justify-center py-16">
      <Card className="w-full max-w-xl text-center">
        <CardContent className="space-y-6 p-8 sm:p-10">
          <h1 className="text-3xl font-extrabold text-text-primary">No worries – you can upgrade anytime</h1>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="amber"><Link to="/pricing">Back to pricing</Link></Button>
            <Button asChild variant="secondary"><Link to="/">Start with free plan</Link></Button>
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
