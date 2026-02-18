import ElectronStore from 'electron-store';

export type LLMProvider = 'groq' | 'openai' | 'anthropic';

export const DEFAULT_HOTKEY = 'CommandOrControl+Shift+C';

interface StoreSchema {
  activeProvider: LLMProvider;
  groqApiKey: string;
  openaiApiKey: string;
  anthropicApiKey: string;
  hotkey: string;
}

const Store =
  (ElectronStore as unknown as { default?: typeof ElectronStore }).default || ElectronStore;

const store = new Store<StoreSchema>({
  schema: {
    activeProvider: { type: 'string', default: 'groq' },
    groqApiKey: { type: 'string', default: '' },
    openaiApiKey: { type: 'string', default: '' },
    anthropicApiKey: { type: 'string', default: '' },
    hotkey: { type: 'string', default: DEFAULT_HOTKEY }
  },
  encryptionKey: 'desktop-ai-encryption-key'
});

const ENV_KEYS: Record<LLMProvider, string> = {
  groq: 'GROQ_API_KEY',
  openai: 'OPENAI_API_KEY',
  anthropic: 'ANTHROPIC_API_KEY'
};

const STORE_KEYS: Record<LLMProvider, keyof StoreSchema> = {
  groq: 'groqApiKey',
  openai: 'openaiApiKey',
  anthropic: 'anthropicApiKey'
};

export function getActiveProvider(): LLMProvider {
  return store.get('activeProvider');
}

export function setActiveProvider(provider: LLMProvider): void {
  store.set('activeProvider', provider);
}

export function getApiKeyForProvider(provider: LLMProvider): string {
  return store.get(STORE_KEYS[provider]) || process.env[ENV_KEYS[provider]] || '';
}

export function setApiKeyForProvider(provider: LLMProvider, key: string): void {
  store.set(STORE_KEYS[provider], key);
}

export function getActiveApiKey(): string {
  return getApiKeyForProvider(getActiveProvider());
}

export function hasApiKeyForProvider(provider: LLMProvider): boolean {
  return getApiKeyForProvider(provider).length > 0;
}

export function hasActiveApiKey(): boolean {
  return getActiveApiKey().length > 0;
}

export function getHotkey(): string {
  return store.get('hotkey') || DEFAULT_HOTKEY;
}

export function setHotkey(accelerator: string): void {
  store.set('hotkey', accelerator);
}

export function resetHotkey(): void {
  store.set('hotkey', DEFAULT_HOTKEY);
}
