'use client'

import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn('text-base leading-6 space-y-3', className)}>
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 className="text-xl font-semibold mt-4 mb-2">{children}</h1>,
        h2: ({ children }) => <h2 className="text-lg font-semibold mt-4 mb-2">{children}</h2>,
        h3: ({ children }) => <h3 className="text-base font-semibold mt-3 mb-1">{children}</h3>,

        p: ({ children }) => <p className="leading-6">{children}</p>,

        ul: ({ children }) => <ul className="list-disc list-outside pl-5 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-outside pl-5 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="leading-6">{children}</li>,

        // Block code — className contains 'language-*'
        pre: ({ children }) => (
          <pre className="bg-black/8 dark:bg-black/40 rounded-xl px-4 py-3 overflow-x-auto text-sm font-mono my-1">
            {children}
          </pre>
        ),
        // Inline code has no className; block code inside <pre> also passes through here
        code: ({ className, children }) => {
          const isBlock = Boolean(className)
          if (isBlock) return <code className={cn('font-mono', className)}>{children}</code>
          return (
            <code className="bg-black/8 dark:bg-white/10 px-1.5 py-0.5 rounded-md text-sm font-mono">
              {children}
            </code>
          )
        },

        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-indigo-400/50 pl-4 text-muted-foreground italic">
            {children}
          </blockquote>
        ),

        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,

        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-500 underline underline-offset-2 hover:text-indigo-400">
            {children}
          </a>
        ),

        hr: () => <hr className="border-border my-3" />,
      }}
    >
      {content}
    </Markdown>
    </div>
  )
}
