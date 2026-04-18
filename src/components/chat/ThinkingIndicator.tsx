'use client'

import { motion } from 'motion/react'

export function ThinkingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.25 }}
      className="flex justify-start"
    >
      <div className="rounded-2xl px-5 py-4 backdrop-blur-md bg-white/50 border border-white/70 shadow-sm shadow-black/5 dark:bg-white/5 dark:border-white/10 dark:shadow-none">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-foreground/50"
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 0.7,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
