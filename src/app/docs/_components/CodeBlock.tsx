"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialOceanic } from "react-syntax-highlighter/dist/cjs/styles/prism";
import type { CSSProperties } from "react";

interface CodeBlockProps {
  children: string;
  language?: string;
  className?: string;
  style?: CSSProperties;
}

export function CodeBlock({
  children,
  language = "typescript",
  className,
  style,
}: CodeBlockProps) {
  return (
    <SyntaxHighlighter
      language={language}
      style={materialOceanic}
      customStyle={{
        borderRadius: "0.5rem",
        fontSize: "0.85rem",
        padding: "1rem",
        margin: 0,
        overflowX: "auto",
        ...style,
      }}
      className={className}
      wrapLongLines
      codeTagProps={{
        style: {
          fontFamily:
            "var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace)",
          whiteSpace: "pre-wrap",
        },
      }}
    >
      {children}
    </SyntaxHighlighter>
  );
}
