import { cn } from "@/lib/utils";

interface CountryFlagProps {
  flag: string;
  country: string;
  className?: string;
}

export function CountryFlag({ flag, country, className }: CountryFlagProps) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-sm font-medium text-text-primary", className)}>
      <span className="text-base" aria-hidden="true">{flag}</span>
      <span>{country}</span>
    </span>
  );
}
