import { BrowserWindow } from 'electron';
import { ipcWebContentSend } from './adapters';
import { formatCopiedText } from './ai-service';

type GetRephrasedText = {
  text: string;
  mainWindow: BrowserWindow;
};

export async function getRephrasedText({ text, mainWindow }: GetRephrasedText) {
  const formattedText = await formatCopiedText({ text });
  console.log('formattedText', formattedText);
  ipcWebContentSend('getRephrasedText', mainWindow.webContents, {
    funny: formattedText.data?.funny ?? '',
    polite: formattedText.data?.polite ?? '',
    professional: formattedText.data?.professional ?? '',
    original: formattedText.data?.original ?? ''
  });
}
