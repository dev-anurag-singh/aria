'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { Message } from '@/types/chat'

interface RateLimit {
  limit: number
  remaining: number
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [rateLimit, setRateLimit] = useState<RateLimit>({ limit: 10, remaining: 10 })

  useEffect(() => {
    fetch('/api/chat')
      .then(r => r.json())
      .then(({ limit, remaining }) => setRateLimit({ limit, remaining }))
  }, [])
  const [rateLimitError, setRateLimitError] = useState(false)
  const charQueue = useRef('')
  const rafId = useRef<number | null>(null)

  const isThinking = messages.some(m => m.role === 'assistant' && m.thinking)

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isThinking) return

    setRateLimitError(false)

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
    charQueue.current = ''

    const history = [...messages, userMessage].slice(-3).map(m => ({
      role: m.role,
      content: m.content,
    }))

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
    })

    const limitHeader = res.headers.get('X-RateLimit-Limit')
    const remainingHeader = res.headers.get('X-RateLimit-Remaining')
    if (limitHeader && remainingHeader) {
      setRateLimit({ limit: Number(limitHeader), remaining: Number(remainingHeader) })
    }

    if (res.status === 429) {
      setRateLimitError(true)
      setMessages(prev => prev.filter(m => m.id !== aiMessageId))
      return
    }

    let firstChunk = true
    let streamDone = false

    const flush = () => {
      if (charQueue.current.length > 0) {
        const chars = charQueue.current.slice(0, 2)
        charQueue.current = charQueue.current.slice(2)
        setMessages(prev =>
          prev.map(m =>
            m.id === aiMessageId ? { ...m, content: m.content + chars } : m
          )
        )
        rafId.current = requestAnimationFrame(flush)
      } else if (streamDone) {
        rafId.current = null
        setMessages(prev =>
          prev.map(m => (m.id === aiMessageId ? { ...m, thinking: false } : m))
        )
      } else {
        rafId.current = null
      }
    }

    const reader = res.body!.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        streamDone = true
        if (!rafId.current) rafId.current = requestAnimationFrame(flush)
        break
      }

      const text = decoder.decode(value)

      if (firstChunk) {
        setMessages(prev =>
          prev.map(m => (m.id === aiMessageId ? { ...m, thinking: false } : m))
        )
        firstChunk = false
      }

      charQueue.current += text
      if (!rafId.current) rafId.current = requestAnimationFrame(flush)
    }
  }, [messages, isThinking])

  return { messages, isThinking, sendMessage, rateLimit, rateLimitError }
}
