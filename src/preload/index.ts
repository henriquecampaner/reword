/* eslint-disable @typescript-eslint/no-explicit-any */
import electron from 'electron';

electron.contextBridge.exposeInMainWorld('electron', {
  subscribeToGetRephrasedText: (callback) => ipcOn('getRephrasedText', callback),
  subscribeToProcessingStarted: (callback) => ipcOn('processingStarted', callback),
  closeWindow: () => {
    electron.ipcRenderer.send('close-window');
  },
  getApiKey: (provider: LLMProvider) => electron.ipcRenderer.invoke('get-api-key', provider),
  setApiKey: (provider: LLMProvider, key: string) =>
    electron.ipcRenderer.invoke('set-api-key', provider, key),
  hasApiKey: (provider: LLMProvider) => electron.ipcRenderer.invoke('has-api-key', provider),
  getActiveProvider: () => electron.ipcRenderer.invoke('get-active-provider'),
  setActiveProvider: (provider: LLMProvider) =>
    electron.ipcRenderer.invoke('set-active-provider', provider),
  getHotkey: () => electron.ipcRenderer.invoke('get-hotkey'),
  setHotkey: (accelerator: string) => electron.ipcRenderer.invoke('set-hotkey', accelerator),
  resetHotkey: () => electron.ipcRenderer.invoke('reset-hotkey')
} satisfies Window['electron']);

function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (data: EventPayloadMapping[Key]) => void
) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
  electron.ipcRenderer.on(key, cb);
  return () => electron.ipcRenderer.off(key, cb);
}
