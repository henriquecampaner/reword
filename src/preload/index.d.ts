type LLMProvider = 'groq' | 'openai' | 'anthropic';

type ToneKey =
  | 'professional'
  | 'formal'
  | 'funny'
  | 'casual'
  | 'friendly'
  | 'persuasive'
  | 'concise';

type RephraseResponse = {
  success: boolean;
  data?: {
    original: string;
    tone: ToneKey;
    result: string;
  };
  error?: string;
};

type GroqModelOption = {
  id: string;
};

type GroqModelsResult = {
  models: GroqModelOption[];
  selectedId: string;
  error?: string;
};

type EventPayloadMapping = {
  processingStarted: {
    originalText: string;
  };
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    subscribeToProcessingStarted: (
      callback: (data: { originalText: string }) => void
    ) => UnsubscribeFunction;
    rephraseWithTone: (text: string, tone: ToneKey) => Promise<RephraseResponse>;
    closeWindow: () => void;
    getApiKey: (provider: LLMProvider) => Promise<string>;
    setApiKey: (provider: LLMProvider, key: string) => Promise<void>;
    hasApiKey: (provider: LLMProvider) => Promise<boolean>;
    getActiveProvider: () => Promise<LLMProvider>;
    setActiveProvider: (provider: LLMProvider) => Promise<void>;
    getHotkey: () => Promise<string>;
    setHotkey: (accelerator: string) => Promise<boolean>;
    resetHotkey: () => Promise<boolean>;
    listGroqModels: () => Promise<GroqModelsResult>;
    getGroqModel: () => Promise<string>;
    setGroqModel: (id: string) => Promise<void>;
  };
}
