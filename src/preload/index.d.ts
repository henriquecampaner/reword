type EventPayloadMapping = {
  getRephrasedText: {
    original: string;
    polite: string;
    professional: string;
    funny: string;
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
  };
}
