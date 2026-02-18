/* eslint-disable @typescript-eslint/no-explicit-any */
import electron from 'electron';

electron.contextBridge.exposeInMainWorld('electron', {
  subscribeToGetRephrasedText: (callback) => ipcOn('getRephrasedText', callback),
  subscribeToProcessingStarted: (callback) => ipcOn('processingStarted', callback),
  closeWindow: () => {
    electron.ipcRenderer.send('close-window');
  },
  getApiKey: () => electron.ipcRenderer.invoke('get-api-key'),
  setApiKey: (key: string) => electron.ipcRenderer.invoke('set-api-key', key),
  hasApiKey: () => electron.ipcRenderer.invoke('has-api-key')
} satisfies Window['electron']);

function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (data: EventPayloadMapping[Key]) => void
) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
  electron.ipcRenderer.on(key, cb);
  return () => electron.ipcRenderer.off(key, cb);
}
