import Link from "next/link";

interface WorkingExampleCardProps {
  href: string;
  label: string;
}

export function WorkingExampleCard({ href, label }: WorkingExampleCardProps) {
  return (
    <Link
      href={href}
      className="group block p-4 bg-secondary-50/80 border border-secondary-200 rounded-xl transition-all duration-200 cursor-pointer ring-4 ring-transparent hover:ring-secondary-700/30 hover:shadow-md dark:bg-secondary-950/80 dark:border-secondary-700"
    >
      <p className="text-sm font-semibold text-secondary-700 mb-1 dark:text-secondary-200">Working Example</p>
      <p className="text-xs text-secondary-600 mb-3 dark:text-secondary-300">
        Open the working example for this topic.
      </p>
      <span className="inline-flex items-center gap-2">
        <code className="rounded bg-surface-raised px-2 py-0.5 text-[0.7rem] font-mono text-foreground dark:bg-surface dark:text-foreground">
          {label}
        </code>
        <span className="text-secondary-500 group-hover:translate-x-0.5 transition-transform duration-200">→</span>
      </span>
    </Link>
  );
}
