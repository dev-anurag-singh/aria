'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import type { Message } from '@/types/chat'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}
    >
      {isUser ? (
        // Right-aligned pill with indigo glass tint
        <div className="max-w-[78%] rounded-2xl px-5 py-3 backdrop-blur-md bg-indigo-500/20 dark:bg-indigo-400/15 border border-indigo-400/30 dark:border-indigo-400/15">
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
      ) : (
        // Full-width glass card for AI
        <div className="w-full rounded-2xl px-5 py-4 backdrop-blur-md bg-white/50 border border-white/70 shadow-sm shadow-black/5 dark:bg-white/5 dark:border-white/10 dark:shadow-none">
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
      )}
    </motion.div>
  )
}
