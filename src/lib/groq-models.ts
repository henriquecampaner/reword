export type GroqModel = {
  id: string;
};

export const PREFERRED_GROQ_MODEL_ID = 'openai/gpt-oss-120b';

const NON_CHAT_ID_PATTERN = /whisper|tts|orpheus|guard/i;

type GroqModelsPayload = {
  data?: Array<{
    id?: unknown;
    active?: unknown;
  }>;
};

export function isChatCapableGroqModel(id: string): boolean {
  return !NON_CHAT_ID_PATTERN.test(id);
}

export function parseGroqModels(payload: unknown): GroqModel[] {
  const data = (payload as GroqModelsPayload | null)?.data;
  if (!Array.isArray(data)) return [];

  return data
    .filter((model): model is { id: string; active?: unknown } => typeof model?.id === 'string')
    .filter((model) => model.active !== false)
    .filter((model) => isChatCapableGroqModel(model.id))
    .map((model) => ({ id: model.id }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function pickGroqModelId(modelIds: string[], savedId?: string): string | undefined {
  if (savedId && modelIds.includes(savedId)) return savedId;
  if (modelIds.includes(PREFERRED_GROQ_MODEL_ID)) return PREFERRED_GROQ_MODEL_ID;
  return modelIds[0];
}

export async function fetchGroqModels(apiKey: string): Promise<GroqModel[]> {
  const response = await fetch('https://api.groq.com/openai/v1/models', {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to list Groq models (${response.status})`);
  }

  return parseGroqModels(await response.json());
}
