"use client";

import Link from "next/link";
import { useState, useCallback } from "react";

// ─── Simulated button variants using cva-like pattern ─────────
const buttonVariants = {
  variant: {
    primary: "bg-primary-500 text-white hover:bg-primary-600 border-transparent",
    secondary: "bg-secondary-500 text-white hover:bg-secondary-600 border-transparent",
    outline: "bg-transparent text-foreground border-border hover:border-foreground hover:bg-surface-raised",
    ghost: "bg-transparent text-muted border-transparent hover:text-foreground hover:bg-surface-raised",
    danger: "bg-error-500 text-white hover:bg-error-600 border-transparent",
  },
  size: {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-4 py-2 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-2xl",
  },
};

type ButtonVariant = keyof typeof buttonVariants.variant;
type ButtonSize = keyof typeof buttonVariants.size;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

function Button({ variant = "primary", size = "md", loading, children, className = "", disabled, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-semibold border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${buttonVariants.variant[variant]} ${buttonVariants.size[size]} ${className}`}
    >
      {loading && <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
}

// ─── Input component ──────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

function Input({ label, error, hint, leading, trailing, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-xs font-medium text-muted">{label}</label>}
      <div className="relative flex items-center">
        {leading && <span className="absolute left-3 text-muted text-sm">{leading}</span>}
        <input
          {...props}
          className={`w-full bg-background border rounded-xl py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 transition ${leading ? "pl-8" : "pl-4"} ${trailing ? "pr-10" : "pr-4"} ${error ? "border-error-400 focus:ring-error-300" : "border-border focus:ring-primary-400"} ${className}`}
        />
        {trailing && <span className="absolute right-3 text-muted text-sm">{trailing}</span>}
      </div>
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs text-error-500">⚠ {error}</p>}
    </div>
  );
}

// ─── Card component ───────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "section";
}

function Card({ children, className = "", as: Tag = "div" }: CardProps) {
  return (
    <Tag className={`rounded-2xl border border-border bg-surface shadow-sm shadow-neutral-900/5 ${className}`}>
      {children}
    </Tag>
  );
}

// ─── Badge component ──────────────────────────────────────────
const badgeColors = {
  default: "bg-surface-raised text-foreground",
  primary: "bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300",
  success: "bg-success-50 text-success-700",
  warning: "bg-warning-50 text-warning-700",
  error: "bg-error-50 text-error-600",
};

function Badge({ color = "default", children }: { color?: keyof typeof badgeColors; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColors[color]}`}>
      {children}
    </span>
  );
}

// ─── Demo Sections ─────────────────────────────────────────────
function ButtonDemo() {
  const [loading, setLoading] = useState<string | null>(null);
  const simulate = useCallback((variant: string) => {
    setLoading(variant);
    setTimeout(() => setLoading(null), 1500);
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-muted mb-2">Variants</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(buttonVariants.variant) as ButtonVariant[]).map((v) => (
            <Button key={v} variant={v} onClick={() => simulate(v)} loading={loading === v}>{v}</Button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs text-muted mb-2">Sizes</p>
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(buttonVariants.size) as ButtonSize[]).map((s) => (
            <Button key={s} size={s}>{s}</Button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs text-muted mb-2">States</p>
        <div className="flex gap-2">
          <Button disabled>disabled</Button>
          <Button loading>loading</Button>
        </div>
      </div>
    </div>
  );
}

function InputDemo() {
  return (
    <div className="space-y-4">
      <Input label="Basic" placeholder="Enter text..." />
      <Input label="With hint" placeholder="john" hint="Only letters and numbers" />
      <Input label="With error" placeholder="bad@email" error="Invalid email address" defaultValue="notanemail" />
      <Input label="With icon" placeholder="Search..." leading="🔍" />
      <Input label="Password" type="password" placeholder="••••••••" trailing="👁" />
    </div>
  );
}

function CardDemo() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-foreground">Basic Card</p>
          <Badge>default</Badge>
        </div>
        <p className="text-xs text-muted">A card with border, background and subtle shadow.</p>
      </Card>
      <Card className="p-4 ring-4 ring-transparent hover:ring-secondary-700/30 transition-all cursor-pointer">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-foreground">Hover Card</p>
          <Badge color="success">active</Badge>
        </div>
        <p className="text-xs text-muted">Hover to see the ring effect.</p>
      </Card>
      <Card className="p-4 col-span-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-lg">🎨</div>
          <div>
            <p className="text-sm font-semibold text-foreground">Wide Card</p>
            <div className="flex gap-1.5 mt-1">
              <Badge color="primary">primary</Badge>
              <Badge color="warning">warning</Badge>
              <Badge color="error">error</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function HowToBuildUI() {
  const [tab, setTab] = useState<"button" | "input" | "card">("button");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 pt-14 pb-24">
        <Link href="/docs/build-ui-component" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition mb-8 group">
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> docs / build-ui-component
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-1">Build UI Components</h1>
        <p className="text-sm text-muted mb-8">Reusable components built with Tailwind variants. No external UI library.</p>

        <div className="flex gap-2 mb-6">
          {(["button", "input", "card"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition capitalize ${tab === t ? "bg-foreground text-background border-foreground" : "bg-surface-raised border-border text-muted hover:text-foreground"}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="p-6 rounded-2xl border border-border bg-surface">
          {tab === "button" && <ButtonDemo />}
          {tab === "input" && <InputDemo />}
          {tab === "card" && <CardDemo />}
        </div>
      </div>
    </div>
  );
}
