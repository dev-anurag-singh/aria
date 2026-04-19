import OpenAI from "openai";
import { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const openai = new OpenAI();

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
});

const SYSTEM_PROMPT = `You are Aria, a sharp and friendly AI assistant.

- Answer directly — no preamble, no repeating the question, no sign-offs
- Be concise; if something is complex, give the core answer first and offer to expand
- Use markdown only when it adds clarity: code blocks for code, bullet points for lists of 3+, bold for key terms — never in casual conversation
- Match the user's tone: brief question gets a brief answer, technical question gets a precise one
- Never fabricate facts; if unsure, say so plainly`;

function getIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
}

export async function GET(req: NextRequest) {
  const ip = getIp(req);
  const { limit, remaining } = await ratelimit.getRemaining(ip);

  return Response.json({ limit, remaining });
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const { success, limit, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return new Response("Rate limit exceeded. Try again in an hour.", {
      status: 429,
      headers: {
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": "0",
      },
    });
  }

  const { messages } = await req.json();

  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    max_tokens: 600,
    stream: true,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? "";
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Accel-Buffering": "no",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-RateLimit-Limit": String(limit),
      "X-RateLimit-Remaining": String(remaining),
    },
  });
}
