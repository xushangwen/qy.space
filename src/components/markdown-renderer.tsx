"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="mt-8 mb-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-6 mb-2 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="mb-3.5 text-[16px] leading-[1.6] text-zinc-800 dark:text-zinc-400 antialiased tracking-normal">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="mb-3.5 ml-5 list-disc space-y-0.5 text-[16px] leading-[1.6] text-zinc-800 marker:text-zinc-400 dark:text-zinc-200">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-3.5 ml-5 list-decimal space-y-0.5 text-[16px] leading-[1.6] text-zinc-800 marker:text-zinc-400 dark:text-zinc-200">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="pl-1">{children}</li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="my-6 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-[15px] leading-relaxed text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
            {children}
          </blockquote>
        ),
        code: ({ className, children }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[13px] font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                {children}
              </code>
            );
          }
          return (
            <code className="block overflow-x-auto rounded-lg bg-[#18181b] p-4 font-mono text-[13px] leading-relaxed text-zinc-300 shadow-sm">
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="my-5 overflow-hidden rounded-lg border border-zinc-200/50 bg-[#18181b] dark:border-zinc-800">
            {children}
          </pre>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            className="font-medium text-zinc-900 underline underline-offset-2 decoration-zinc-300 transition-colors hover:decoration-zinc-900 dark:text-zinc-100 dark:decoration-zinc-700 dark:hover:decoration-zinc-100"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-inherit">{children}</strong>
        ),
        hr: () => <hr className="my-8 border-zinc-100 dark:border-zinc-800" />,
        img: ({ src, alt }) => (
          <span className="my-5 block overflow-hidden rounded-lg border border-zinc-100 bg-zinc-50 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="w-full object-cover transition-opacity hover:opacity-95"
              loading="lazy"
            />
            {alt && (
              <span className="block border-t border-zinc-100 bg-zinc-50/50 px-4 py-2 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
                {alt}
              </span>
            )}
          </span>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
