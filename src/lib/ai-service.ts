import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';

export interface FormatTextRequest {
  text: string;
  model?: string;
}

export interface FormatTextResponse {
  success: boolean;
  data?: {
    original: string;
    professional: string;
    polite: string;
    funny: string;
  };
  error?: string;
}

export async function formatCopiedText(request: FormatTextRequest): Promise<FormatTextResponse> {
  try {
    console.time('formatCopiedText');
    // Get the API key from environment variables
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        error: 'Groq API key not found. Please set GROQ_API_KEY environment variable.'
      };
    }

    if (!request.text || request.text.trim() === '') {
      return {
        success: false,
        error: 'No text provided to format'
      };
    }

    const model = groq('llama-3.3-70b-versatile');
    const text = request.text;

    const shared = { model, maxTokens: 80, temperature: 0.7 } as const;

    // Fire all three style rewrites in parallel for maximum speed
    const [professional, polite, funny] = await Promise.all([
      generateText({
        ...shared,
        system:
          "You rewrite text in different tones. Transform the given text into a professional, formal, business-appropriate version. Example: 'hey what's up' becomes 'Hello, how may I assist you?' Output ONLY the rewritten text, nothing else.",
        prompt: `Text to rewrite: "${text}"`
      }),
      generateText({
        ...shared,
        system:
          "You rewrite text in different tones. Transform the given text into a polite, courteous, respectful version. Example: 'hey what's up' becomes 'Hello, how are you doing today?' Output ONLY the rewritten text, nothing else.",
        prompt: `Text to rewrite: "${text}"`
      }),
      generateText({
        ...shared,
        system:
          "You rewrite text in different tones. Transform the given text into a funny, witty, humorous version while keeping the core message. Example: 'hey what's up' becomes 'Well hello there, what's the latest gossip in your world?' Output ONLY the rewritten text, nothing else.",
        prompt: `Text to rewrite: "${text}"`
      })
    ]);

    console.timeEnd('formatCopiedText');

    return {
      success: true,
      data: {
        original: text,
        professional: professional.text,
        polite: polite.text,
        funny: funny.text
      }
    };
  } catch (error) {
    console.error('Error formatting text:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
