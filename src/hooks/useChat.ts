'use client'

import { useState, useCallback } from 'react'
import type { Message } from '@/types/chat'

const MOCK_RESPONSE = `
## Understanding React Server Components

React Server Components (RSC) let you render components entirely on the server, shipping **zero JavaScript** to the client for those components.

### Key Benefits

- **Performance** — only interactive parts send JS to the browser
- **Direct data access** — query your database without an API layer
- **Smaller bundles** — server components are never included in the client bundle

### Quick Example

\`\`\`tsx
async function UserProfile({ userId }: { userId: string }) {
  const user = await db.users.findById(userId)

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
\`\`\`

Mark a file with \`'use client'\` only when you need **state**, **effects**, or browser APIs. Everything else stays on the server by default.

> This is a placeholder response — real answers will come from the AI backend once connected.
`

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])

  // Derived — no separate isThinking state needed
  const isThinking = messages.some(m => m.role === 'assistant' && m.thinking)

  const sendMessage = useCallback((content: string) => {
    if (!content.trim() || isThinking) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      thinking: false,
      timestamp: new Date(),
    }

    // AI message added immediately as a placeholder — updated in-place when response arrives
    const aiMessageId = crypto.randomUUID()
    const aiPlaceholder: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      thinking: true,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage, aiPlaceholder])

    // Replace with actual response — swap this setTimeout with an API call later
    const delay = 1500 + Math.random() * 1000
    setTimeout(() => {
      setMessages(prev =>
        prev.map(m =>
          m.id === aiMessageId
            ? { ...m, content: MOCK_RESPONSE, thinking: false }
            : m
        )
      )
    }, delay)
  }, [isThinking])

  return { messages, isThinking, sendMessage }
}
