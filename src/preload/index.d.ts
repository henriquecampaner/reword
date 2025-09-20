type EventPayloadMapping = {
  getCopyText: { text: string };
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    subscribeToGetCopyText: (callback: (data: { text: string }) => void) => UnsubscribeFunction;
  };
}
