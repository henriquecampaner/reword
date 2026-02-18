import { generateText, type LanguageModel } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import type { LLMProvider } from './store';

export interface FormatTextRequest {
  text: string;
  apiKey?: string;
  provider?: LLMProvider;
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

function createModel(provider: LLMProvider, apiKey: string): LanguageModel {
  switch (provider) {
    case 'groq': {
      const groq = createGroq({ apiKey });
      return groq('llama-3.3-70b-versatile');
    }
    case 'openai': {
      const openai = createOpenAI({ apiKey });
      return openai('gpt-4o-mini');
    }
    case 'anthropic': {
      const anthropic = createAnthropic({ apiKey });
      return anthropic('claude-sonnet-4-20250514');
    }
  }
}

export async function formatCopiedText(request: FormatTextRequest): Promise<FormatTextResponse> {
  try {
    console.time('formatCopiedText');
    const provider = request.provider ?? 'groq';
    const apiKey = request.apiKey;

    if (!apiKey) {
      return {
        success: false,
        error: `API key not found for ${provider}. Please add your API key in the settings.`
      };
    }

    if (!request.text || request.text.trim() === '') {
      return {
        success: false,
        error: 'No text provided to format'
      };
    }

    const model = createModel(provider, apiKey);
    const text = request.text;

    const shared = { model, maxTokens: 80, temperature: 0.3 } as const;

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
