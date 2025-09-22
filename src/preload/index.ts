/* eslint-disable @typescript-eslint/no-explicit-any */
import electron from 'electron';

electron.contextBridge.exposeInMainWorld('electron', {
  subscribeToGetRephrasedText: (callback) => ipcOn('getRephrasedText', callback),
  subscribeToProcessingStarted: (callback) => ipcOn('processingStarted', callback),
  closeWindow: () => {
    electron.ipcRenderer.send('close-window');
  }
} satisfies Window['electron']);

// function ipcInvoke<Key extends keyof EventPayloadMapping>(
//   key: Key
// ): Promise<EventPayloadMapping[Key]> {
//   return electron.ipcRenderer.invoke(key);
// }

function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (data: EventPayloadMapping[Key]) => void
) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
  electron.ipcRenderer.on(key, cb);
  return () => electron.ipcRenderer.off(key, cb);
}

// function ipcSend<Key extends keyof EventPayloadMapping>(
//   key: Key,
//   payload: EventPayloadMapping[Key]
// ) {
//   electron.ipcRenderer.send(key, payload);
// }
