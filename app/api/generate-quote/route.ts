import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.MODEL_API_KEY,
});

export async function POST(): Promise<Response> {
  try {
    const stream = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {"role": "system", "content": "You are a helpful assistant."},
        {
          role: "user",
          content: "Generate a concise motivational quote (≤300 chars). Format: 'quote'. Return only one quote.",
        },
      ],
      temperature: 0.99,
      stream: true, // Enable streaming
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            controller.enqueue(new TextEncoder().encode(content));
          }
        } catch (error) {
          console.error("Stream error:", error);
          controller.enqueue(new TextEncoder().encode("Error in stream"));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error("Generation failed:", error);
    return NextResponse.json(
      { error: "Error generating quote stream" },
      { status: 500 }
    );
  }
}
