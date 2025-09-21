import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// Schema for text formatting response
export const textFormattingSchema = z.object({
  original: z.string().describe('The original copied text'),
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

    // Create a comprehensive prompt for text formatting
    const prompt = `
Take the following text and rewrite it in three different styles while maintaining the core message and meaning:

Original text: "${request.text}"

Please provide:
1. Professional: Rewrite in a formal, business-appropriate tone suitable for workplace communication
2. Polite: Rewrite in a courteous, respectful, and diplomatic tone that's friendly but not overly casual
3. Funny: Rewrite in a humorous, witty, and entertaining way while keeping the original message clear

Make sure each version maintains the original intent and key information but adapts the tone appropriately.
`;

    // Generate the formatted text using AI SDK
    const result = await generateObject({
      model: openai('gpt-5-nano'),
      schema: textFormattingSchema,
      prompt
    });

    return {
      success: true,
      data: result.object
    };
  } catch (error) {
    console.error('Error formatting text:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
