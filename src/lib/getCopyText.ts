import { BrowserWindow } from 'electron';
import { ipcWebContentSend } from './adapters';
import { formatCopiedText } from './ai-service';
import { getApiKey } from './store';

type GetRephrasedText = {
  text: string;
  mainWindow: BrowserWindow;
};

export async function getRephrasedText({ text, mainWindow }: GetRephrasedText) {
  ipcWebContentSend('processingStarted', mainWindow.webContents, {
    originalText: text
  });

  const apiKey = getApiKey();
  const formattedText = await formatCopiedText({ text, apiKey });
  console.log('formattedText', formattedText);
  ipcWebContentSend('getRephrasedText', mainWindow.webContents, {
    funny: formattedText.data?.funny ?? '',
    professional: formattedText.data?.professional ?? '',
    formal: formattedText.data?.formal ?? '',
    original: formattedText.data?.original ?? ''
  });
}
