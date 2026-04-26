import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  open?: boolean;
  duration?: number;
  onClose?: () => void;
  className?: string;
}

export function Toast({ message, open = true, duration = 3500, onClose, className }: ToastProps) {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    setVisible(open);
  }, [open]);

  useEffect(() => {
    if (!visible) return;
    const timeout = window.setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    return () => window.clearTimeout(timeout);
  }, [duration, onClose, visible]);

  if (!visible) return null;

  return (
    <div className={cn("fixed right-4 top-4 z-50 flex max-w-sm items-center gap-3 rounded-card border border-border bg-surface px-4 py-3 text-sm font-medium text-text-primary shadow-surface animate-slide-in-menu", className)} role="status">
      <span className="size-2 rounded-pill bg-accent-amber" aria-hidden="true" />
      <span className="flex-1">{message}</span>
      <button className="rounded-pill p-1 text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => { setVisible(false); onClose?.(); }} aria-label="Dismiss notification">
        <X className="size-4" />
      </button>
    </div>
  );
}
