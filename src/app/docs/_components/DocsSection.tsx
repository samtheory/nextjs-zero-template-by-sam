import type { ReactNode } from "react";

interface DocsSectionProps {
  children: ReactNode;
  className?: string;
}

export function DocsSection({ children, className = "" }: DocsSectionProps) {
  return (
    <section
      className={`rounded-3xl border border-border/80 bg-surface-raised p-6 shadow-sm shadow-neutral-900/5 transition duration-200 hover:-translate-y-0.5 hover:border-primary-300 dark:border-border dark:bg-surface dark:hover:border-primary-500 ${className}`}
    >
      {children}
    </section>
  );
}
