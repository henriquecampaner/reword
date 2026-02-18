import { generateText, type LanguageModel } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import type { LLMProvider } from './store';

export type ToneKey =
  | 'professional'
  | 'formal'
  | 'funny'
  | 'casual'
  | 'friendly'
  | 'persuasive'
  | 'concise';

const TONE_PROMPTS: Record<ToneKey, string> = {
  professional:
    'Transform the text into a professional, business-appropriate version while preserving the exact meaning and information.',
  formal:
    'Transform the text into a formal, official version suitable for formal documents while preserving the exact meaning and information.',
  funny:
    'Transform the text into a funny, witty, or humorous version while preserving the exact meaning and core information. Add humour through wordplay or playful language.',
  casual:
    'Transform the text into a casual, relaxed version as if talking to a friend while preserving the exact meaning and information.',
  friendly:
    'Transform the text into a warm, friendly, and approachable version while preserving the exact meaning and information.',
  persuasive:
    'Transform the text into a persuasive, compelling version that motivates action while preserving the exact meaning and information.',
  concise:
    'Transform the text into a shorter, more concise version that gets straight to the point while preserving the core meaning and information.'
};

export interface RephraseRequest {
  text: string;
  tone: ToneKey;
  apiKey?: string;
  provider?: LLMProvider;
}

export interface RephraseResponse {
  success: boolean;
  data?: {
    original: string;
    tone: ToneKey;
    result: string;
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

export async function rephraseWithTone(request: RephraseRequest): Promise<RephraseResponse> {
  try {
    console.time('rephraseWithTone');
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
    const tonePrompt = TONE_PROMPTS[request.tone];

    const result = await generateText({
      model,
      maxOutputTokens: 200,
      temperature: 0.3,
      system: `You rewrite text in different tones. Fix any grammar errors using British English spelling and grammar. ${tonePrompt} Do not add new information or expand unnecessarily. Output ONLY the rewritten text.`,
      prompt: `Text to rewrite: "${request.text}"`
    });

    console.timeEnd('rephraseWithTone');

    return {
      success: true,
      data: {
        original: request.text,
        tone: request.tone,
        result: result.text
      }
    };
  } catch (error) {
    console.error('Error rephrasing text:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
