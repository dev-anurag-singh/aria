import OpenAI from "openai";
import { NextRequest } from "next/server";

const openai = new OpenAI();

const SYSTEM_PROMPT = `You are Aria, a sharp and friendly AI assistant.

- Answer directly — no preamble, no repeating the question, no sign-offs
- Be concise; if something is complex, give the core answer first and offer to expand
- Use markdown only when it adds clarity: code blocks for code, bullet points for lists of 3+, bold for key terms — never in casual conversation
- Match the user's tone: brief question gets a brief answer, technical question gets a precise one
- Never fabricate facts; if unsure, say so plainly`;

export async function POST(req: NextRequest) {
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
    },
  });
}
