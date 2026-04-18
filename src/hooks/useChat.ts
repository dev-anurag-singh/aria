'use client'

import { useState, useCallback } from 'react'
import type { Message } from '@/types/chat'

// Placeholder responses until backend is connected
const MOCK_RESPONSES = [
  "That's a great question. Once I'm connected to the AI backend, I'll be able to give you a thoughtful and accurate response.",
  "Interesting! I'm running in demo mode right now — the real AI integration will handle this properly.",
  "I understand what you mean. The full version will process your message and respond intelligently in real time.",
  "Good point. When the backend is live, I'll be able to reason through this and give you something genuinely useful.",
]

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isThinking, setIsThinking] = useState(false)

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || isThinking) return

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, userMessage])
      setIsThinking(true)

      // Simulated delay — replace with actual API call later
      const delay = 1500 + Math.random() * 1000
      setTimeout(() => {
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)],
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, aiMessage])
        setIsThinking(false)
      }, delay)
    },
    [isThinking]
  )

  return { messages, isThinking, sendMessage }
}
