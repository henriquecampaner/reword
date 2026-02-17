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
    formal: string;
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

    const shared = { model, maxTokens: 80, temperature: 0.3 } as const;

    // Fire all three style rewrites in parallel for maximum speed
    const [professional, formal, funny] = await Promise.all([
      generateText({
        ...shared,
        system:
          'You rewrite text in different tones. For each text provided, give a Professional version. Fix any grammar errors using British English spelling and grammar. Transform the text into a professional, business-appropriate version while preserving the exact meaning and information. Do not add new information or expand unnecessarily. Output ONLY the rewritten text.',
        prompt: `Text to rewrite: "${text}"`
      }),
      generateText({
        ...shared,
        system:
          'You rewrite text in different tones. For each text provided, give a Formal version. Fix any grammar errors using British English spelling and grammar. Transform the text into a formal, official version suitable for formal documents while preserving the exact meaning and information. Do not add new information or expand unnecessarily. Output ONLY the rewritten text.',
        prompt: `Text to rewrite: "${text}"`
      }),
      generateText({
        ...shared,
        system:
          'You rewrite text in different tones. For each text provided, give a Funny version. Fix any grammar errors using British English spelling and grammar. Transform the text into a funny, witty, or humorous version while preserving the exact meaning and core information. Add humour through wordplay or playful language, but do not add new information or expand unnecessarily. Output ONLY the rewritten text.',
        prompt: `Text to rewrite: "${text}"`
      })
    ]);

    console.timeEnd('formatCopiedText');

    return {
      success: true,
      data: {
        original: text,
        professional: professional.text,
        formal: formal.text,
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
