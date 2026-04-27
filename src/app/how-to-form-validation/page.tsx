"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

// ─── Schema: full checkout form ───────────────────────────────
const checkoutSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  cardNumber: z.string()
    .transform((s) => s.replace(/\s/g, ""))
    .pipe(z.string().length(16, "Card number must be 16 digits").regex(/^\d+$/, "Digits only")),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, "Format: MM/YY").refine((s) => {
    const [mm, yy] = s.split("/").map(Number);
    const now = new Date();
    const expDate = new Date(2000 + yy, mm - 1);
    return mm >= 1 && mm <= 12 && expDate > now;
  }, "Card is expired or invalid"),
  cvv: z.string().regex(/^\d{3,4}$/, "3 or 4 digits"),
  terms: z.literal(true, { errorMap: () => ({ message: "You must accept the terms" }) }),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-error-500 mt-1 flex items-center gap-1"><span>⚠</span>{error}</p>}
    </div>
  );
}

const cls = (err: boolean) =>
  `w-full text-sm bg-background border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 placeholder:text-muted transition ${err ? "border-error-400 focus:ring-error-300" : "border-border focus:ring-primary-400"}`;

// ─── Card number formatter ────────────────────────────────────
function formatCard(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function CheckoutForm() {
  const [submitted, setSubmitted] = useState(false);
  const [cardDisplay, setCardDisplay] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur",
  });

  return submitted ? (
    <div className="p-6 rounded-xl bg-success-50 border border-success-100 text-center">
      <div className="text-3xl mb-2">✓</div>
      <p className="text-sm font-semibold text-success-700">Payment submitted successfully!</p>
      <button onClick={() => setSubmitted(false)} className="mt-3 text-xs text-success-600 hover:text-success-800 underline">Reset</button>
    </div>
  ) : (
    <form onSubmit={handleSubmit(async () => { await new Promise(r => setTimeout(r, 500)); setSubmitted(true); })} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="First name" error={errors.firstName?.message}>
          <input {...register("firstName")} placeholder="Alice" className={cls(!!errors.firstName)} />
        </Field>
        <Field label="Last name" error={errors.lastName?.message}>
          <input {...register("lastName")} placeholder="Smith" className={cls(!!errors.lastName)} />
        </Field>
      </div>
      <Field label="Email" error={errors.email?.message}>
        <input {...register("email")} placeholder="alice@example.com" className={cls(!!errors.email)} />
      </Field>
      <Field label="Card number" error={errors.cardNumber?.message}>
        <input
          value={cardDisplay}
          onChange={(e) => {
            const fmt = formatCard(e.target.value);
            setCardDisplay(fmt);
            setValue("cardNumber", fmt, { shouldValidate: false });
          }}
          onBlur={() => setValue("cardNumber", cardDisplay, { shouldValidate: true })}
          placeholder="4242 4242 4242 4242"
          className={cls(!!errors.cardNumber)}
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Expiry (MM/YY)" error={errors.expiry?.message}>
          <input {...register("expiry")} placeholder="12/26" className={cls(!!errors.expiry)} />
        </Field>
        <Field label="CVV" error={errors.cvv?.message}>
          <input {...register("cvv")} placeholder="123" maxLength={4} className={cls(!!errors.cvv)} />
        </Field>
      </div>
      <div className="flex items-start gap-2">
        <input type="checkbox" {...register("terms")} id="terms" className="mt-0.5" />
        <label htmlFor="terms" className="text-xs text-muted">
          I agree to the <span className="text-primary-500 underline cursor-pointer">terms and conditions</span>
        </label>
      </div>
      {errors.terms && <p className="text-xs text-error-500">⚠ {errors.terms.message}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 disabled:opacity-50 transition"
      >
        {isSubmitting ? "Processing..." : "Pay now"}
      </button>
    </form>
  );
}

// ─── Error display patterns ────────────────────────────────────
function ErrorPatterns() {
  const [type, setType] = useState<"inline" | "toast" | "summary">("inline");

  const errors = [
    { field: "Email", message: "Enter a valid email address" },
    { field: "Password", message: "Must be at least 8 characters" },
    { field: "Username", message: "Only letters, numbers, underscores" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["inline", "toast", "summary"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${type === t ? "bg-secondary-500 text-white border-secondary-500" : "bg-surface-raised border-border text-muted hover:text-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {type === "inline" && (
        <div className="space-y-3">
          {errors.map((e) => (
            <div key={e.field}>
              <label className="text-xs text-muted">{e.field}</label>
              <div className="mt-1 border border-error-400 rounded-xl px-4 py-2.5 bg-background text-sm text-muted">{e.field.toLowerCase()}@...</div>
              <p className="text-xs text-error-500 mt-1">⚠ {e.message}</p>
            </div>
          ))}
        </div>
      )}

      {type === "toast" && (
        <div className="fixed bottom-6 right-6 space-y-2 z-50 pointer-events-none">
          {errors.map((e, i) => (
            <div key={i} className="px-4 py-3 rounded-xl bg-error-600 text-white text-xs shadow-xl flex items-center gap-2">
              <span>⚠</span>
              <span><strong>{e.field}:</strong> {e.message}</span>
            </div>
          ))}
        </div>
      )}

      {type === "summary" && (
        <div className="p-4 rounded-xl border border-error-200 bg-error-50">
          <p className="text-sm font-semibold text-error-700 mb-2">Please fix these errors:</p>
          <ul className="space-y-1">
            {errors.map((e, i) => (
              <li key={i} className="text-xs text-error-600 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-error-400 shrink-0" />
                <strong>{e.field}:</strong> {e.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function HowToFormValidation() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 pt-14 pb-24">
        <Link href="/docs/form-validation" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition mb-8 group">
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> docs / form-validation
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-1">Form Validation & Error Handling</h1>
        <p className="text-sm text-muted mb-10">A real checkout form with complex validation, plus error display pattern comparison.</p>

        <div className="space-y-10">
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">1 — Complex form (card number, expiry, cross-field)</p>
            <div className="p-6 rounded-2xl border border-border bg-surface"><CheckoutForm /></div>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-3">2 — Error display patterns</p>
            <div className="p-6 rounded-2xl border border-border bg-surface"><ErrorPatterns /></div>
          </section>
        </div>
      </div>
    </div>
  );
}
