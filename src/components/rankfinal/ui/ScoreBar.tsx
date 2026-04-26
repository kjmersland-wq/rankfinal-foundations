import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScoreBarProps {
  score: number;
  className?: string;
  label?: string;
}

export function ScoreBar({ score, className, label = "Score" }: ScoreBarProps) {
  const safeScore = Math.max(0, Math.min(10, score));
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let frame = 0;
    const totalFrames = 42;
    const tick = () => {
      frame += 1;
      const progress = 1 - Math.pow(1 - frame / totalFrames, 3);
      setDisplayScore(Number((safeScore * Math.min(progress, 1)).toFixed(1)));
      if (frame < totalFrames) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [safeScore, visible]);

  return (
    <div ref={ref} className={cn("w-full space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        {label && <span className="font-medium text-text-secondary">{label}</span>}
        <span className="ml-auto font-bold text-text-primary">{displayScore.toFixed(1)}/10</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-pill bg-secondary">
        <div
          className="h-full rounded-pill bg-accent-amber transition-[width] duration-1000 ease-out"
          style={{ width: visible ? `${safeScore * 10}%` : "0%" }}
          role="progressbar"
          aria-valuenow={safeScore}
          aria-valuemin={0}
          aria-valuemax={10}
        />
      </div>
    </div>
  );
}
