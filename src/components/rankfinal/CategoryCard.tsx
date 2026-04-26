import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { RankFinalCategory } from "@/data/categories";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: RankFinalCategory;
  compact?: boolean;
  className?: string;
}

export function CategoryCard({ category, compact = false, className }: CategoryCardProps) {
  return (
    <Card className={cn("group h-full overflow-hidden hover:-translate-y-1 hover:shadow-amber", className)}>
      <CardContent className={cn("flex h-full flex-col", compact ? "p-4" : "p-5")}>
        <div className="mb-5 flex items-start justify-between gap-3">
          <span className="flex size-12 items-center justify-center rounded-card border border-border bg-secondary text-2xl transition-transform duration-300 group-hover:-translate-y-1 hover:shadow-amber" aria-hidden="true">
            {category.icon}
          </span>
          <span className="rounded-pill border border-border bg-background px-3 py-1 text-xs font-semibold text-text-secondary">
            {category.subcategories.length} subcategories
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <div>
            <h3 className="text-lg font-extrabold leading-tight text-text-primary">{category.name}</h3>
            {!compact && <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-secondary">{category.description}</p>}
          </div>
          <Link
            to={`/browse?category=${category.id}`}
            className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-accent-amber transition-transform duration-200 group-hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Explore <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
