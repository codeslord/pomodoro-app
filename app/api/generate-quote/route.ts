import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY, // Use server-side environment variable
});

// Define the response type
type ApiResponse = {
  quote?: string;
  error?: string;
};

export async function POST(): Promise<NextResponse<ApiResponse>> {
  try {
    const completion = await openai.chat.completions.create({
      // model: "deepseek/deepseek-r1:free",
      model: "meta-llama/llama-3.2-1b-instruct:free",
      messages: [
        {
          role: "user",
          content: "Generate a concise motivational quote (≤250 chars) about perseverance and success. Optionally use a famous quote. Format: '[quote]' – [Author]. Return only the quote.",
        },
      ],
    });

    const generatedQuote = completion.choices[0]?.message?.content?.trim() ?? "Error generating quote";
    return NextResponse.json({ quote: generatedQuote });
  } catch (error) {
    console.error("Generation failed:", error);
    return NextResponse.json({ error: "Error generating quote" }, { status: 500 });
  }
}