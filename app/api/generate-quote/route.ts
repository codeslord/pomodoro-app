import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
// const openai = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: process.env.OPENROUTER_API_KEY, // Use server-side environment variable
// });
const openai = new OpenAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  apiKey: process.env.MODEL_API_KEY, // Use server-side environment variable
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
      // model: "meta-llama/llama-3.2-1b-instruct:free",
      // model: "google/gemini-2.0-flash-exp:free",
      model: "gemini-1.5-flash",
      messages: [
        {"role": "system", "content": "You are a helpful assistant."},
        {
          role: "user",
          content: "Generate a concise motivational quote (≤300 chars). Format: 'quote'. Return only one quote. ",
        },
      ],
      temperature: 0.99,
      // seed: Date.now(),
    });

    const generatedQuote = completion.choices[0]?.message?.content?.trim() ?? "Error generating quote";
    console.log("Generated quote:", generatedQuote)
    return NextResponse.json({ quote: generatedQuote }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (error) {
    console.error("Generation failed:", error);
    return NextResponse.json({ error: "Error generating quote" }, { status: 500 });
  }
}