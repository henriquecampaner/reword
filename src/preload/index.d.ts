type LLMProvider = 'groq' | 'openai' | 'anthropic';

type EventPayloadMapping = {
  getRephrasedText: {
    original: string;
    professional: string;
    formal: string;
    funny: string;
  };
  processingStarted: {
    originalText: string;
  };
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    subscribeToGetRephrasedText: (
      callback: (data: {
        original: string;
        professional: string;
        formal: string;
        funny: string;
      }) => void
    ) => UnsubscribeFunction;
    subscribeToProcessingStarted: (
      callback: (data: { originalText: string }) => void
    ) => UnsubscribeFunction;
    closeWindow: () => void;
    getApiKey: (provider: LLMProvider) => Promise<string>;
    setApiKey: (provider: LLMProvider, key: string) => Promise<void>;
    hasApiKey: (provider: LLMProvider) => Promise<boolean>;
    getActiveProvider: () => Promise<LLMProvider>;
    setActiveProvider: (provider: LLMProvider) => Promise<void>;
  };
}
