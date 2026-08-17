import { BrowserWindow } from 'electron';
import { ipcWebContentSend } from './adapters';
import { rephraseWithTone, type ToneKey, type RephraseResponse } from './ai-service';
import { getActiveApiKey, getActiveProvider, getGroqModelId } from './store';

type SendSelectedTextParams = {
  text: string;
  mainWindow: BrowserWindow;
};

export function sendSelectedText({ text, mainWindow }: SendSelectedTextParams): void {
  ipcWebContentSend('processingStarted', mainWindow.webContents, {
    originalText: text
  });
}

export async function rephraseTextWithTone(text: string, tone: ToneKey): Promise<RephraseResponse> {
  const provider = getActiveProvider();
  const apiKey = getActiveApiKey();
  return rephraseWithTone({
    text,
    tone,
    apiKey,
    provider,
    groqModelId: provider === 'groq' ? getGroqModelId() : undefined
  });
}
