type EventPayloadMapping = {
  getRephrasedText: {
    original: string;
    polite: string;
    professional: string;
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
        polite: string;
        professional: string;
        funny: string;
      }) => void
    ) => UnsubscribeFunction;
    subscribeToProcessingStarted: (
      callback: (data: { originalText: string }) => void
    ) => UnsubscribeFunction;
  };
}
