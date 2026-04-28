import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const COOKIE_KEY = "rankfinal_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user has made a choice
    const consent = localStorage.getItem(COOKIE_KEY);
    setVisible(consent !== "accepted" && consent !== "rejected");
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(COOKIE_KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-card border border-border bg-surface p-4 shadow-amber animate-fade-in">
      <div className="flex flex-col gap-4">
        <p className="text-sm leading-6 text-text-secondary">
          <strong className="text-text-primary">We use essential cookies only.</strong> 
          {" "}No tracking or advertising cookies. Essential cookies are required for authentication and basic site functionality.
          {" "}<Link to="/cookies" className="underline hover:text-text-primary">Learn more about our cookie policy</Link>
        </p>
        <div className="flex shrink-0 gap-2 flex-wrap">
          <Button variant="secondary" size="sm" onClick={reject}>
            Reject Optional
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link to="/cookies">Manage Preferences</Link>
          </Button>
          <Button variant="amber" size="sm" onClick={accept}>
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
}
