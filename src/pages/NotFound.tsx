import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/rankfinal/ui";
import { PageWrapper } from "@/components/rankfinal/layout";
import { Badge } from "@/components/rankfinal/ui";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PageWrapper className="min-h-[70vh] py-16">
      <div className="mx-auto max-w-3xl space-y-6 text-center">
        <Badge variant="red">404</Badge>
        <h1 className="text-4xl font-extrabold text-text-primary sm:text-6xl">Page not found.</h1>
        <p className="text-lg text-text-secondary">Search for what you need:</p>
        <SearchBar containerClassName="mx-auto h-14 max-w-none" />
        <Button asChild variant="amber" size="lg"><Link to="/">Back to home</Link></Button>
      </div>
    </PageWrapper>
  );
};

export default NotFound;
