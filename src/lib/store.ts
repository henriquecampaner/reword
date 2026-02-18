import ElectronStore from 'electron-store';

interface StoreSchema {
  groqApiKey: string;
}

// Handle CJS/ESM interop — the constructor may be on .default
const Store = (ElectronStore as unknown as { default?: typeof ElectronStore }).default || ElectronStore;

const store = new Store<StoreSchema>({
  schema: {
    groqApiKey: {
      type: 'string',
      default: ''
    }
  },
  encryptionKey: 'desktop-ai-encryption-key'
});

export function getApiKey(): string {
  return store.get('groqApiKey') || process.env.GROQ_API_KEY || '';
}

export function setApiKey(key: string): void {
  store.set('groqApiKey', key);
}

export function hasApiKey(): boolean {
  return getApiKey().length > 0;
}
