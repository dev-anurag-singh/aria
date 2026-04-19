"use client";

import { useState, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RateLimit {
  limit: number;
  remaining: number;
}

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled: boolean;
  rateLimit?: RateLimit;
  rateLimitError?: boolean;
}

function UsageIndicator({ rateLimit }: { rateLimit?: RateLimit }) {
  const used = rateLimit ? rateLimit.limit - rateLimit.remaining : 0;
  const limit = rateLimit?.limit ?? 10;
  const pct = used / limit;

  const dotColor = pct === 0
    ? "bg-emerald-400"
    : pct < 0.5
    ? "bg-emerald-400"
    : pct < 0.8
    ? "bg-amber-400"
    : "bg-red-400";

  const textColor = pct === 0
    ? "text-emerald-500 dark:text-emerald-400"
    : pct < 0.5
    ? "text-emerald-500 dark:text-emerald-400"
    : pct < 0.8
    ? "text-amber-500 dark:text-amber-400"
    : "text-red-500 dark:text-red-400";

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: limit }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 w-3 rounded-full transition-all duration-300",
              i < used ? dotColor : "bg-black/10 dark:bg-white/10"
            )}
          />
        ))}
      </div>
      <span className={cn("text-xs font-medium tabular-nums transition-colors duration-300", textColor)}>
        {used}/{limit}
      </span>
    </div>
  );
}

export function ChatInput({ onSend, disabled, rateLimit, rateLimitError }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="w-full max-w-3xl mx-auto px-4 pb-6"
    >
      <div className="flex flex-col rounded-2xl backdrop-blur-xl bg-white/60 border border-white/80 shadow-lg shadow-black/8 dark:bg-white/8 dark:border-white/15 dark:shadow-black/40">
        <Textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Aria..."
          disabled={disabled}
          className="w-full resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 min-h-0 px-4 pt-4 pb-2 text-base md:text-base leading-6 placeholder:text-muted-foreground/50 dark:bg-transparent disabled:bg-transparent dark:disabled:bg-transparent"
        />

        <div className="flex items-center justify-between px-3 pb-3">
          <UsageIndicator rateLimit={rateLimit} />
          <Button
            onClick={handleSend}
            disabled={!canSend}
            size="icon"
            className={cn(
              "h-8 w-8 rounded-lg transition-all duration-200",
              canSend
                ? "bg-indigo-500 hover:bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                : "bg-black/8 text-black/25 dark:bg-white/10 dark:text-white/25"
            )}
            aria-label="Send message"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <p className="text-center text-xs md:text-sm mt-3 text-muted-foreground/40">
        {rateLimitError
          ? "You've reached the limit of 10 messages per hour. Try again later."
          : "Shift + Enter for new line · Refreshing clears your conversation"}
      </p>
    </motion.div>
  );
}
