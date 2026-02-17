import { BrowserWindow } from 'electron';
import { ipcWebContentSend } from './adapters';
import { formatCopiedText } from './ai-service';

type GetRephrasedText = {
  text: string;
  mainWindow: BrowserWindow;
};

export async function getRephrasedText({ text, mainWindow }: GetRephrasedText) {
  // Emit processing started event
  ipcWebContentSend('processingStarted', mainWindow.webContents, {
    originalText: text
  });

  const formattedText = await formatCopiedText({ text });
  console.log('formattedText', formattedText);
  ipcWebContentSend('getRephrasedText', mainWindow.webContents, {
    funny: formattedText.data?.funny ?? '',
    professional: formattedText.data?.professional ?? '',
    formal: formattedText.data?.formal ?? '',
    original: formattedText.data?.original ?? ''
  });
}
