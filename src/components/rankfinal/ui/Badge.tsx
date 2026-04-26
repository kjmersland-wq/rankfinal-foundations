import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-pill border px-3 py-1 text-xs font-semibold leading-none",
  {
    variants: {
      variant: {
        amber: "border-accent-amber/30 bg-accent-amber/15 text-accent-amber",
        purple: "border-accent-purple/30 bg-accent-purple/15 text-accent-purple",
        green: "border-success/30 bg-success/15 text-success",
        gray: "border-border bg-secondary text-text-secondary",
        red: "border-destructive/30 bg-destructive/15 text-destructive",
      },
    },
    defaultVariants: {
      variant: "gray",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
