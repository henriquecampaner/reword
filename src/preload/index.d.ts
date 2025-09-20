type Statistics = {
  cpuUsage: number;
  ramUsage: number;
  storageUsage: number;
};

type StaticData = {
  totalStorage: number;
  cpuModel: string;
  totalMemoryGB: number;
};

type FrameAction = 'CLOSE' | 'MINIMIZE' | 'MAXIMIZE';

type View = 'CPU' | 'RAM' | 'STORAGE';

type EventPayloadMapping = {
  statistics: Statistics;
  getStaticData: StaticData;
  changeView: View;
  sendFrameAction: FrameAction;
  getCopyText: { text: string };
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    subscribeToStatistics: (callback: (data: Statistics) => void) => UnsubscribeFunction;
    getStaticData: () => Promise<StaticData>;
    subscribeToGetCopyText: (callback: (data: { text: string }) => void) => UnsubscribeFunction;
    subscribeToView: (callback: (data: View) => void) => UnsubscribeFunction;
    sendFrameAction: (action: FrameAction) => void;
  };
}
