import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export function SearchBar({ className, containerClassName, ...props }: SearchBarProps) {
  return (
    <label
      className={cn(
        "group flex h-11 w-full max-w-xl items-center gap-3 rounded-input border border-border bg-surface px-4 transition-all duration-300 focus-within:max-w-2xl focus-within:border-accent-amber/70 focus-within:shadow-amber",
        containerClassName,
      )}
    >
      <Search className="size-4 text-text-secondary transition-colors group-focus-within:text-accent-amber" aria-hidden="true" />
      <input
        type="search"
        className={cn(
          "h-full min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary",
          className,
        )}
        placeholder="Search rankings, countries, categories..."
        autoComplete="off"
        {...props}
      />
    </label>
  );
}
