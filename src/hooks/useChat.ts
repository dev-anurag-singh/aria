'use client'

import { useState, useCallback } from 'react'
import type { Message } from '@/types/chat'

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])

  const isThinking = messages.some(m => m.role === 'assistant' && m.thinking)

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isThinking) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      thinking: false,
      timestamp: new Date(),
    }

    const aiMessageId = crypto.randomUUID()
    const aiPlaceholder: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      thinking: true,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage, aiPlaceholder])

    // Send only last 3 messages (prev context + new user message)
    const history = [...messages, userMessage].slice(-3).map(m => ({
      role: m.role,
      content: m.content,
    }))

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
    })

    const reader = res.body!.getReader()
    const decoder = new TextDecoder()
    let firstChunk = true

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const text = decoder.decode(value)

      setMessages(prev =>
        prev.map(m =>
          m.id === aiMessageId
            ? { ...m, content: m.content + text, thinking: firstChunk ? false : m.thinking }
            : m
        )
      )
      firstChunk = false
    }

    // Ensure thinking is cleared after stream ends
    setMessages(prev =>
      prev.map(m => (m.id === aiMessageId ? { ...m, thinking: false } : m))
    )
  }, [messages, isThinking])

  return { messages, isThinking, sendMessage }
}
