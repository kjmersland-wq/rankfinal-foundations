import { cn } from "@/lib/utils";

interface ScoreBarProps {
  score: number;
  className?: string;
  label?: string;
}

export function ScoreBar({ score, className, label = "Score" }: ScoreBarProps) {
  const safeScore = Math.max(0, Math.min(10, score));

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-text-secondary">{label}</span>
        <span className="font-bold text-text-primary">{safeScore.toFixed(1)}/10</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-pill bg-secondary">
        <div
          className="h-full origin-left rounded-pill bg-accent-amber animate-score-fill"
          style={{ width: `${safeScore * 10}%` }}
          role="progressbar"
          aria-valuenow={safeScore}
          aria-valuemin={0}
          aria-valuemax={10}
        />
      </div>
    </div>
  );
}
