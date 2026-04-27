"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const colors = ["bg-primary-500", "bg-secondary-500", "bg-accent-500", "bg-info-500", "bg-error-500"];

// ─── 1. Basic motion.div (fade + slide) ──────────────────────
function FadeSlideDemo() {
  const [show, setShow] = useState(true);
  return (
    <div className="space-y-4">
      <button
        onClick={() => setShow((s) => !s)}
        className="px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition"
      >
        {show ? "Hide" : "Show"}
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="p-4 rounded-xl bg-primary-50 border border-primary-100 dark:bg-primary-950/40 dark:border-primary-900"
          >
            <p className="text-sm font-semibold text-primary-700 dark:text-primary-300">I animate in and out!</p>
            <p className="text-xs text-primary-500 mt-1">initial → animate → exit (AnimatePresence)</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── 2. Spring physics ───────────────────────────────────────
function SpringDemo() {
  const [scale, setScale] = useState(1);
  return (
    <div className="flex items-center gap-6">
      <motion.div
        animate={{ scale }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-16 h-16 rounded-2xl bg-secondary-500 flex items-center justify-center text-white font-bold text-xl cursor-pointer"
        onClick={() => setScale((s) => (s === 1 ? 1.5 : 1))}
      >
        {scale > 1 ? "→" : "·"}
      </motion.div>
      <div className="text-xs text-muted space-y-1">
        <p>Click to toggle scale</p>
        <p className="font-mono">spring: stiffness 300, damping 20</p>
      </div>
    </div>
  );
}

// ─── 3. Variants ─────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0 },
};

function VariantsDemo() {
  const [key, setKey] = useState(0);
  return (
    <div className="space-y-3">
      <button
        onClick={() => setKey((k) => k + 1)}
        className="px-4 py-1.5 rounded-xl border border-border text-xs text-muted hover:text-foreground hover:border-foreground transition"
      >
        Replay
      </button>
      <motion.ul key={key} variants={containerVariants} initial="hidden" animate="show" className="space-y-2">
        {["Define variants object", "Pass to parent: variants={{ ... }}", "Children inherit via useAnimation", "staggerChildren staggers each child"].map((item, i) => (
          <motion.li key={i} variants={itemVariants} className="flex items-center gap-2 text-sm text-foreground">
            <span className={`w-2 h-2 rounded-full shrink-0 ${colors[i % colors.length]}`} />
            {item}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

// ─── 4. Gesture (whileHover + whileTap) ──────────────────────
function GestureDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: "var(--color-primary-600, #4f46e5)" }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold"
      >
        Hover + Tap me
      </motion.button>
      <motion.div
        whileHover={{ rotate: 15 }}
        whileTap={{ rotate: -15 }}
        className="w-12 h-12 rounded-xl bg-accent-400 flex items-center justify-center text-xl cursor-pointer"
      >
        🎲
      </motion.div>
      <motion.div
        drag
        dragConstraints={{ left: -100, right: 100, top: -30, bottom: 30 }}
        whileDrag={{ scale: 1.1 }}
        className="w-12 h-12 rounded-xl bg-secondary-400 flex items-center justify-center text-xl cursor-grab active:cursor-grabbing select-none"
      >
        ✋
      </motion.div>
    </div>
  );
}

// ─── 5. AnimatePresence list ──────────────────────────────────
let idCounter = 10;
function ListDemo() {
  const [items, setItems] = useState([
    { id: 1, text: "First item" },
    { id: 2, text: "Second item" },
    { id: 3, text: "Third item" },
  ]);

  const add = () => {
    idCounter++;
    setItems((prev) => [...prev, { id: idCounter, text: `Item ${idCounter}` }]);
  };

  return (
    <div className="space-y-3">
      <button onClick={add} className="px-4 py-1.5 rounded-xl bg-secondary-500 text-white text-xs font-semibold hover:bg-secondary-600 transition">
        + Add item
      </button>
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface-raised">
              <span className="text-sm text-foreground">{item.text}</span>
              <button
                onClick={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
                className="text-xs text-muted hover:text-error-500 transition"
              >
                remove
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function HowToFramerMotion() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 pt-14 pb-24">
        <Link href="/docs/framer-motion" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition mb-8 group">
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> docs / framer-motion
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-1">Framer Motion</h1>
        <p className="text-sm text-muted mb-10">Interactive animation demos. Play with each example.</p>

        <div className="space-y-10">
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">1 — Fade + Slide (AnimatePresence)</p>
            <div className="p-6 rounded-2xl border border-border bg-surface min-h-30"><FadeSlideDemo /></div>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-3">2 — Spring physics</p>
            <div className="p-6 rounded-2xl border border-border bg-surface"><SpringDemo /></div>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-600 mb-3">3 — Variants + staggerChildren</p>
            <div className="p-6 rounded-2xl border border-border bg-surface"><VariantsDemo /></div>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-info-600 mb-3">4 — Gestures (hover, tap, drag)</p>
            <div className="p-6 rounded-2xl border border-border bg-surface"><GestureDemo /></div>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-error-600 mb-3">5 — AnimatePresence list (add / remove)</p>
            <div className="p-6 rounded-2xl border border-border bg-surface"><ListDemo /></div>
          </section>
        </div>
      </div>
    </div>
  );
}
