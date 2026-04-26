import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function RouteShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.search]);

  return <div key={location.pathname} className="animate-fade-in">{children}</div>;
}
