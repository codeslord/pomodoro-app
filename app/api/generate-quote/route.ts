import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.MODEL_API_KEY,
});

export async function POST(): Promise<Response> {
  try {
    // Create more variability with theme selection
    const themes = [
      "perseverance", "creativity", "focus", "balance", 
      "growth", "resilience", "patience", "courage", 
      "wisdom", "innovation", "discipline", "mindfulness"
    ];
    
    // Select random theme and style
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    const styleOptions = ["inspirational", "philosophical", "practical", "metaphorical", "direct"];
    const randomStyle = styleOptions[Math.floor(Math.random() * styleOptions.length)];
    
    // Add timestamp to ensure uniqueness
    const timestamp = new Date().getTime();

    const stream = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          "role": "system", 
          "content": `You are a quote generator specializing in unique, diverse motivational quotes. 
                     Never repeat quotes. Current timestamp: ${timestamp}`
        },
        {
          role: "user",
          content: `Generate a fresh, original motivational quote about ${randomTheme} in a ${randomStyle} style. 
                   Make it concise (under 300 characters) and different from common quotes. 
                   Don't use the phrase "Believe in yourself, take the leap" or similar overused expressions.
                   Return only the quote text with no additional formatting.`
        },
      ],
      temperature: 0.9, // Increased for more variation
      stream: true,
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
