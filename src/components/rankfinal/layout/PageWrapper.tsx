import { cn } from "@/lib/utils";

interface PageWrapperProps extends React.HTMLAttributes<HTMLElement> {}

export function PageWrapper({ className, children, ...props }: PageWrapperProps) {
  return (
    <main className={cn("mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8", className)} {...props}>
      {children}
    </main>
  );
}
