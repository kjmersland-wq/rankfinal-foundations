import { cn } from "@/lib/utils";

interface UpdateBadgeProps {
  hours: number;
  className?: string;
}

export function UpdateBadge({ hours, className }: UpdateBadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-pill border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold text-success", className)}>
      <span className="size-2 rounded-pill bg-success animate-pulse-dot" aria-hidden="true" />
      Updated {hours}h ago
    </span>
  );
}
