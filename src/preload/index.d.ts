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
  showPopup: void;
  hidePopup: void;
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    subscribeToStatistics: (callback: (data: Statistics) => void) => UnsubscribeFunction;
    getStaticData: () => Promise<StaticData>;
    subscribeToView: (callback: (data: View) => void) => UnsubscribeFunction;
    sendFrameAction: (action: FrameAction) => void;
    onShowPopup: (callback: () => void) => UnsubscribeFunction;
    onHidePopup: (callback: () => void) => UnsubscribeFunction;
  };
}
