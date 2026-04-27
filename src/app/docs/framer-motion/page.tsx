import Link from "next/link";

export default function FramerMotionDoc() {
  return (
    <>
      <div className="mb-2"><span className="text-xs text-muted">UI &amp; Animation</span></div>
      <h1 className="text-3xl font-bold text-foreground mb-2">Framer Motion</h1>
      <p className="text-muted text-base mb-8 leading-relaxed">
        Production-grade animation library. In this project it's imported as <code className="font-mono bg-surface-raised px-1 rounded text-foreground">framer-motion</code> (v12, which is the same as motion.dev). Always wrap animated components in <code className="font-mono bg-surface-raised px-1 rounded text-foreground">"use client"</code>.
      </p>

      <div className="space-y-10">

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Basic motion Element</h2>
          <pre className="bg-code-bg border border-code-border rounded-lg p-4 overflow-x-auto text-xs font-mono text-code-text">
            <code>{`"use client";
import { motion } from "framer-motion";

// motion.div = animated <div>
// Any HTML element: motion.span, motion.button, motion.li, etc.

export function FadeIn() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}    // starting state
      animate={{ opacity: 1, y: 0 }}     // target state
      exit={{ opacity: 0, y: -8 }}       // when unmounted (needs AnimatePresence)
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      Hello!
    </motion.div>
  );
}`}</code>
          </pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Variants (reusable animation definitions)</h2>
          <pre className="bg-code-bg border border-code-border rounded-lg p-4 overflow-x-auto text-xs font-mono text-code-text">
            <code>{`"use client";
import { motion } from "framer-motion";

// Define variants outside the component
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,   // each child animates 0.1s after previous
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function AnimatedList({ posts }: { posts: Post[] }) {
  return (
    <motion.ul variants={container} initial="hidden" animate="show">
      {posts.map((post) => (
        // Children inherit parent's variant state automatically
        <motion.li key={post.id} variants={item}>
          {post.title}
        </motion.li>
      ))}
    </motion.ul>
  );
}`}</code>
          </pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">AnimatePresence (enter/exit animations)</h2>
          <pre className="bg-code-bg border border-code-border rounded-lg p-4 overflow-x-auto text-xs font-mono text-code-text">
            <code>{`"use client";
import { motion, AnimatePresence } from "framer-motion";

// AnimatePresence enables exit animations when a component is removed
export function Modal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black"
            onClick={onClose}
          />
          {/* Modal panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 top-1/4 bg-surface rounded-xl p-6 shadow-xl"
          >
            Content
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}`}</code>
          </pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Gesture Animations</h2>
          <pre className="bg-code-bg border border-code-border rounded-lg p-4 overflow-x-auto text-xs font-mono text-code-text">
            <code>{`"use client";
import { motion } from "framer-motion";

// Hover and tap
<motion.button
  whileHover={{ scale: 1.03, backgroundColor: "#4f46e5" }}
  whileTap={{ scale: 0.97 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Click me
</motion.button>

// Drag
<motion.div
  drag
  dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
  className="w-12 h-12 rounded-full bg-primary-500 cursor-grab active:cursor-grabbing"
/>`}</code>
          </pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">useMotionValue &amp; useTransform</h2>
          <pre className="bg-code-bg border border-code-border rounded-lg p-4 overflow-x-auto text-xs font-mono text-code-text">
            <code>{`"use client";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

export function ParallaxCard() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Map mouse position to rotation
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  // Spring physics for smooth feel
  const springX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  return (
    <motion.div
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 1000 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="w-48 h-64 bg-surface border border-border rounded-xl"
    />
  );
}`}</code>
          </pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">Page Transitions</h2>
          <pre className="bg-code-bg border border-code-border rounded-lg p-4 overflow-x-auto text-xs font-mono text-code-text">
            <code>{`// app/template.tsx — use template.tsx NOT layout.tsx for page transitions
// layout.tsx persists between routes; template.tsx unmounts and remounts
"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}`}</code>
          </pre>
        </section>

        <section className="p-4 bg-error-50 border border-error-200 rounded-xl">
          <p className="text-sm font-semibold text-error-700 mb-1">Working Example</p>
          <Link href="/how-to-framer-motion" className="inline-flex items-center gap-1.5 text-xs font-semibold text-error-600 hover:text-error-800">
            <code className="bg-error-100 px-1.5 py-0.5 rounded">src/features/how-to-framer-motion</code>
            <span>→</span>
          </Link>
        </section>
      </div>
    </>
  );
}
