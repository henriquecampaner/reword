import { BrowserWindow } from 'electron';
import { ipcWebContentSend } from './adapters';

type GetCopyText = {
  text: string;
  mainWindow: BrowserWindow;
};

export function getCopyText({ text, mainWindow }: GetCopyText) {
  ipcWebContentSend('getCopyText', mainWindow.webContents, { text });
}
