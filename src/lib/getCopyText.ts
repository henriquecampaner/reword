import { BrowserWindow } from 'electron';
import { ipcWebContentSend } from './adapters';
import { formatCopiedText } from './ai-service';
import { getActiveApiKey, getActiveProvider } from './store';

type GetRephrasedText = {
  text: string;
  mainWindow: BrowserWindow;
};

export async function getRephrasedText({ text, mainWindow }: GetRephrasedText) {
  ipcWebContentSend('processingStarted', mainWindow.webContents, {
    originalText: text
  });

  const provider = getActiveProvider();
  const apiKey = getActiveApiKey();
  const formattedText = await formatCopiedText({ text, apiKey, provider });
  console.log('formattedText', formattedText);
  ipcWebContentSend('getRephrasedText', mainWindow.webContents, {
    funny: formattedText.data?.funny ?? '',
    professional: formattedText.data?.professional ?? '',
    formal: formattedText.data?.formal ?? '',
    original: formattedText.data?.original ?? ''
  });
}
