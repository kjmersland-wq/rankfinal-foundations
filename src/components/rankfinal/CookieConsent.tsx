import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const COOKIE_KEY = "rankfinal_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(localStorage.getItem(COOKIE_KEY) !== "accepted");
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-card border border-border bg-surface p-4 shadow-amber animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-text-secondary"><strong className="text-text-primary">We use essential cookies only.</strong> No tracking or advertising cookies.</p>
        <div className="flex shrink-0 gap-2">
          <Button asChild variant="secondary" size="sm"><Link to="/cookies">Manage</Link></Button>
          <Button variant="amber" size="sm" onClick={accept}>Accept</Button>
        </div>
      </div>
    </div>
  );
}
