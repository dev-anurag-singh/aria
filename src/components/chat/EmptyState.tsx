'use client'

import { motion } from 'motion/react'

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center text-center select-none mb-8 px-4"
    >
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Aria</h1>
    </motion.div>
  )
}
