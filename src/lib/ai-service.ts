import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// Schema for text formatting response
export const textFormattingSchema = z.object({
  professional: z
    .string()
    .describe('Professional version of the text - formal, business-appropriate tone'),
  polite: z
    .string()
    .describe('Polite version of the text - courteous, respectful, and diplomatic tone'),
  funny: z
    .string()
    .describe(
      'Funny version of the text - humorous, witty, and entertaining while maintaining the core message'
    )
});

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
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        error: 'OpenAI API key not found. Please set OPENAI_API_KEY environment variable.'
      };
    }

    if (!request.text || request.text.trim() === '') {
      return {
        success: false,
        error: 'No text provided to format'
      };
    }

    // Create a concise prompt for text formatting
    const prompt = `Rewrite this text in three styles:

"${request.text}"

1. Professional: Formal, business tone
2. Polite: Courteous, respectful tone
3. Funny: Humorous while keeping the message clear`;

    // Generate the formatted text using AI SDK with optimized parameters
    const result = await generateObject({
      model: openai('gpt-5-nano'),
      schema: textFormattingSchema,
      prompt,
      temperature: 0.7
    });

    console.timeEnd('formatCopiedText');

    return {
      success: true,
      data: {
        original: request.text,
        professional: result.object.professional,
        polite: result.object.polite,
        funny: result.object.funny
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
