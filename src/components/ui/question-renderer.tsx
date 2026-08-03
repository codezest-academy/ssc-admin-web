import React from "react";
import "katex/dist/katex.min.css";
import katex from "katex";
import { cn } from "@/lib/utils";

export interface QuestionRendererProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
}

export function QuestionRenderer({ content, className, ...props }: QuestionRendererProps) {
  // Pre-process the HTML string to render math BEFORE it hits the DOM.
  // This completely avoids React DOM mutation conflicts.
  const renderedContent = React.useMemo(() => {
    try {
      let html = content;

      // Render Display Math: $$ ... $$
      html = html.replace(/\$\$(.*?)\$\$/gs, (match, math) => {
        try {
          return katex.renderToString(math, { displayMode: true, throwOnError: false, errorColor: "#ef4444" });
        } catch (e) {
          return match; // fallback to raw string on fatal error
        }
      });

      // Render Display Math: \[ ... \]
      html = html.replace(/\\\[(.*?)\\\]/gs, (match, math) => {
        try {
          return katex.renderToString(math, { displayMode: true, throwOnError: false, errorColor: "#ef4444" });
        } catch (e) {
          return match;
        }
      });

      // Render Inline Math: \( ... \)
      html = html.replace(/\\\((.*?)\\\)/gs, (match, math) => {
        try {
          return katex.renderToString(math, { displayMode: false, throwOnError: false, errorColor: "#ef4444" });
        } catch (e) {
          return match;
        }
      });

      return html;
    } catch (e) {
      console.error("KaTeX pre-processing error:", e);
      return content;
    }
  }, [content]);

  return (
    <div
      className={cn("prose prose-sm dark:prose-invert max-w-none text-foreground [&_.katex]:text-foreground", className)}
      dangerouslySetInnerHTML={{ __html: renderedContent }}
      {...props}
    />
  );
}
