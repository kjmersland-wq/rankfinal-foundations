import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const VISITS_KEY = "rankfinal_visit_count";
const DISMISSED_KEY = "rankfinal_a2hs_dismissed";

export function AddToHomePrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const visits = Number(localStorage.getItem(VISITS_KEY) || "0") + 1;
    localStorage.setItem(VISITS_KEY, String(visits));
    if (visits >= 3 && localStorage.getItem(DISMISSED_KEY) !== "true") {
      const timeout = window.setTimeout(() => setVisible(true), 1200);
      return () => window.clearTimeout(timeout);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm rounded-card border border-border bg-surface p-4 shadow-surface animate-fade-in">
      <p className="text-sm font-semibold text-text-primary">Add RankFinal to your Home Screen for faster access.</p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="amber" onClick={() => setVisible(false)}>Got it</Button>
        <Button size="sm" variant="ghost" onClick={() => { localStorage.setItem(DISMISSED_KEY, "true"); setVisible(false); }}>Dismiss</Button>
      </div>
    </div>
  );
}
