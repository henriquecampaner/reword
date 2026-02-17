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
  };
}
