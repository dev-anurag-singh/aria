'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence } from 'motion/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageBubble } from './MessageBubble'
import { ThinkingIndicator } from './ThinkingIndicator'
import type { Message } from '@/types/chat'

interface MessageListProps {
  messages: Message[]
  isThinking: boolean
}

export function MessageList({ messages, isThinking }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  return (
    <ScrollArea className="flex-1 w-full">
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-4 flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isThinking && <ThinkingIndicator key="thinking" />}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
