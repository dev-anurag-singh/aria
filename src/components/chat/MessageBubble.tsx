'use client'

import { motion, AnimatePresence } from 'motion/react'
import type { Message } from '@/types/chat'
import { MarkdownRenderer } from './MarkdownRenderer'

interface MessageBubbleProps {
  message: Message
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-foreground/50"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={isUser ? 'flex justify-end' : 'flex justify-start'}
    >
      {isUser ? (
        <div className="max-w-[78%] rounded-2xl px-5 py-3 bg-indigo-500/20 border border-indigo-400/30 dark:bg-indigo-400/15 dark:border-indigo-400/15">
          <p className="text-base leading-6">{message.content}</p>
        </div>
      ) : (
        // AI bubble: appears once, content switches in-place — no second animation
        <div className="w-full rounded-2xl px-5 py-4 backdrop-blur-md bg-white/50 border border-white/70 shadow-sm dark:bg-white/5 dark:border-white/10 dark:shadow-none">
          <AnimatePresence mode="wait">
            {message.thinking ? (
              <motion.div
                key="thinking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <ThinkingDots />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <MarkdownRenderer content={message.content} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
