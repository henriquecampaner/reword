import React, { useState, useEffect, useCallback, useRef } from 'react';
import './index.css';

type LLMProvider = 'groq' | 'openai' | 'anthropic';

interface ProviderConfig {
  id: LLMProvider;
  name: string;
  description: string;
  model: string;
  placeholder: string;
  docsUrl: string;
  gradient: string;
  borderColor: string;
  iconBg: string;
}

const PROVIDERS: ProviderConfig[] = [
  {
    id: 'groq',
    name: 'Groq',
    description: 'Ultra-fast inference',
    model: 'GPT OSS 120B',
    placeholder: 'gsk_...',
    docsUrl: 'console.groq.com',
    gradient: 'from-orange-500/5 to-amber-500/5',
    borderColor: 'border-orange-400/20',
    iconBg: 'from-orange-500/20 to-amber-500/20'
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT models',
    model: 'GPT-4o Mini',
    placeholder: 'sk-...',
    docsUrl: 'platform.openai.com',
    gradient: 'from-emerald-500/5 to-teal-500/5',
    borderColor: 'border-emerald-400/20',
    iconBg: 'from-emerald-500/20 to-teal-500/20'
  },
  {
    id: 'anthropic',
    name: 'Claude',
    description: 'Anthropic models',
    model: 'Claude Sonnet 4',
    placeholder: 'sk-ant-...',
    docsUrl: 'console.anthropic.com',
    gradient: 'from-amber-500/5 to-yellow-500/5',
    borderColor: 'border-amber-400/20',
    iconBg: 'from-amber-500/20 to-yellow-500/20'
  }
];

function ProviderKeyRow({
  provider,
  isActive,
  onActivate
}: {
  provider: ProviderConfig;
  isActive: boolean;
  onActivate: () => void;
}) {
  const [maskedKey, setMaskedKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [groqModels, setGroqModels] = useState<GroqModelOption[]>([]);
  const [groqModelId, setGroqModelId] = useState('');
  const [groqModelsError, setGroqModelsError] = useState('');
  const [groqModelsLoading, setGroqModelsLoading] = useState(false);

  const loadKey = useCallback(async () => {
    const exists = await window.electron.hasApiKey(provider.id);
    setHasKey(exists);
    if (exists) {
      const masked = await window.electron.getApiKey(provider.id);
      setMaskedKey(masked);
    }
  }, [provider.id]);

  useEffect(() => {
    loadKey();
  }, [loadKey]);

  const loadGroqModels = useCallback(async () => {
    if (provider.id !== 'groq') return;
    setGroqModelsLoading(true);
    setGroqModelsError('');
    try {
      const result = await window.electron.listGroqModels();
      setGroqModels(result.models);
      setGroqModelId(result.selectedId);
      if (result.error) setGroqModelsError(result.error);
    } catch {
      setGroqModelsError('Failed to load Groq models');
    } finally {
      setGroqModelsLoading(false);
    }
  }, [provider.id]);

  useEffect(() => {
    if (hasKey && provider.id === 'groq') {
      void loadGroqModels();
    }
  }, [hasKey, loadGroqModels, provider.id]);

  const handleSave = async () => {
    if (!inputValue.trim()) return;
    setIsSaving(true);
    try {
      await window.electron.setApiKey(provider.id, inputValue.trim());
      setHasKey(true);
      const masked = await window.electron.getApiKey(provider.id);
      setMaskedKey(masked);
      setInputValue('');
      setIsEditing(false);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
      if (provider.id === 'groq') {
        void loadGroqModels();
      }
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue('');
    }
  };

  return (
    <div
      className={`bg-gradient-to-r ${provider.gradient} rounded-xl p-4 border ${
        isActive ? provider.borderColor + ' ring-1 ring-white/[0.06]' : 'border-white/[0.08]'
      } transition-all duration-300`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-9 h-9 rounded-lg bg-gradient-to-br ${provider.iconBg} border border-white/10 flex items-center justify-center`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="text-white/80"
          >
            <path
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="text-left flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-white">{provider.name}</h4>
            {provider.id !== 'groq' && (
              <span className="text-[10px] text-white/40 bg-white/5 px-1.5 py-0.5 rounded">
                {provider.model}
              </span>
            )}
          </div>
          <p className="text-xs text-white/40">{provider.docsUrl}</p>
        </div>
        <div className="flex items-center gap-2">
          {hasKey && (
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
              <span className="text-[10px] text-emerald-400/70">Key set</span>
            </div>
          )}
          <button
            onClick={onActivate}
            disabled={!hasKey}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              isActive
                ? 'bg-white/15 text-white border border-white/20'
                : hasKey
                  ? 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/80'
                  : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
            }`}
          >
            {isActive ? 'Active' : 'Use'}
          </button>
        </div>
      </div>

      {hasKey && !isEditing ? (
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-left overflow-hidden">
            <span className="text-white/40 text-xs font-mono truncate block">{maskedKey}</span>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200 text-xs"
          >
            Change
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="password"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={provider.placeholder}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder-white/25 focus:outline-none focus:border-white/25 focus:ring-1 focus:ring-white/10 transition-all duration-200"
            autoFocus={isEditing}
          />
          <button
            onClick={handleSave}
            disabled={isSaving || !inputValue.trim()}
            className="px-4 py-2 rounded-lg bg-white/15 text-white text-xs font-medium hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSaving ? (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Save'
            )}
          </button>
          {isEditing && (
            <button
              onClick={() => {
                setIsEditing(false);
                setInputValue('');
              }}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200 text-xs"
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {saveStatus === 'saved' && (
        <div className="mt-2 flex items-center gap-1.5 text-emerald-400 text-xs">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6L5 9L10 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Key saved
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="mt-2 text-red-400 text-xs">Failed to save. Please try again.</div>
      )}

      {provider.id === 'groq' && hasKey && (
        <div className="mt-3">
          <label className="block text-[10px] uppercase tracking-wide text-white/35 mb-1.5">
            Model
          </label>
          <select
            value={groqModels.some((model) => model.id === groqModelId) ? groqModelId : ''}
            disabled={groqModelsLoading || groqModels.length === 0}
            onChange={async (e) => {
              const id = e.target.value;
              setGroqModelId(id);
              await window.electron.setGroqModel(id);
            }}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-white/25 focus:ring-1 focus:ring-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {groqModelsLoading && groqModels.length === 0 ? (
              <option value="">Loading models…</option>
            ) : groqModels.length === 0 ? (
              <option value="">No chat models available</option>
            ) : (
              groqModels.map((model) => (
                <option key={model.id} value={model.id} className="bg-zinc-900">
                  {model.id}
                </option>
              ))
            )}
          </select>
          {groqModelsError && (
            <p className="mt-1.5 text-[11px] text-red-400/80">{groqModelsError}</p>
          )}
        </div>
      )}
    </div>
  );
}

const DEFAULT_ACCELERATOR = 'CommandOrControl+Shift+C';

function acceleratorToDisplay(accelerator: string, isMac: boolean): string {
  return accelerator
    .replace(/CommandOrControl/g, isMac ? 'Cmd' : 'Ctrl')
    .replace(/\+/g, ' + ');
}

function keyEventToAccelerator(e: React.KeyboardEvent): string | null {
  const modifiers: string[] = [];
  if (e.ctrlKey || e.metaKey) modifiers.push('CommandOrControl');
  if (e.shiftKey) modifiers.push('Shift');
  if (e.altKey) modifiers.push('Alt');

  const IGNORED = new Set([
    'Control',
    'Shift',
    'Alt',
    'Meta',
    'CapsLock',
    'NumLock',
    'ScrollLock'
  ]);
  if (IGNORED.has(e.key)) return null;
  if (modifiers.length === 0) return null;

  const KEY_MAP: Record<string, string> = {
    ArrowUp: 'Up',
    ArrowDown: 'Down',
    ArrowLeft: 'Left',
    ArrowRight: 'Right',
    ' ': 'Space',
    Escape: 'Escape',
    Enter: 'Return',
    Backspace: 'Backspace',
    Delete: 'Delete',
    Tab: 'Tab'
  };
  const key = KEY_MAP[e.key] ?? e.key.toUpperCase();

  return [...modifiers, key].join('+');
}

function HotkeyRecorder({
  currentHotkey,
  isMac,
  onHotkeyChanged
}: {
  currentHotkey: string;
  isMac: boolean;
  onHotkeyChanged: (hotkey: string) => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [pendingAccelerator, setPendingAccelerator] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRecording && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isRecording]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.key === 'Escape') {
      setIsRecording(false);
      setPendingAccelerator(null);
      return;
    }
    const accel = keyEventToAccelerator(e);
    if (accel) {
      setPendingAccelerator(accel);
      setIsRecording(false);
    }
  };

  const handleSave = async () => {
    if (!pendingAccelerator) return;
    setSaveStatus('saving');
    try {
      const success = await window.electron.setHotkey(pendingAccelerator);
      if (success) {
        onHotkeyChanged(pendingAccelerator);
        setPendingAccelerator(null);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleReset = async () => {
    setSaveStatus('saving');
    try {
      await window.electron.resetHotkey();
      onHotkeyChanged(DEFAULT_ACCELERATOR);
      setPendingAccelerator(null);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const displayValue = pendingAccelerator
    ? acceleratorToDisplay(pendingAccelerator, isMac)
    : acceleratorToDisplay(currentHotkey, isMac);

  const isDefault = !pendingAccelerator && currentHotkey === DEFAULT_ACCELERATOR;

  return (
    <div className="bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-xl p-4 border border-blue-400/20">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="text-white/80"
          >
            <rect
              x="2"
              y="6"
              width="20"
              height="12"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path d="M6 10h2m2 0h2m2 0h2m2 0h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8 14h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="text-left flex-1">
          <h4 className="text-sm font-semibold text-white">Keyboard Shortcut</h4>
          <p className="text-xs text-white/40">
            {isDefault ? 'Using default shortcut' : 'Custom shortcut set'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isRecording ? (
          <div
            ref={inputRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              setIsRecording(false);
              setPendingAccelerator(null);
            }}
            className="flex-1 bg-white/10 border border-blue-400/40 rounded-lg px-3 py-2.5 text-white text-xs font-mono text-center focus:outline-none focus:ring-1 focus:ring-blue-400/40 animate-pulse"
          >
            Press your shortcut...
          </div>
        ) : (
          <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-center">
            <kbd className="text-white/80 text-xs font-mono">{displayValue}</kbd>
            {pendingAccelerator && (
              <span className="ml-2 text-[10px] text-amber-400/70">unsaved</span>
            )}
          </div>
        )}
        {!isRecording && !pendingAccelerator && (
          <button
            onClick={() => setIsRecording(true)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200 text-xs"
          >
            Change
          </button>
        )}
        {pendingAccelerator && (
          <>
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="px-4 py-2 rounded-lg bg-white/15 text-white text-xs font-medium hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              {saveStatus === 'saving' ? (
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Save'
              )}
            </button>
            <button
              onClick={() => setPendingAccelerator(null)}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200 text-xs"
            >
              Cancel
            </button>
          </>
        )}
        {!isRecording && !pendingAccelerator && !isDefault && (
          <button
            onClick={handleReset}
            disabled={saveStatus === 'saving'}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200 text-xs"
          >
            Reset
          </button>
        )}
      </div>

      {saveStatus === 'saved' && (
        <div className="mt-2 flex items-center gap-1.5 text-emerald-400 text-xs">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6L5 9L10 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Shortcut updated
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="mt-2 text-red-400 text-xs">
          Failed to register shortcut. It may conflict with another application.
        </div>
      )}
    </div>
  );
}

function App(): React.JSX.Element {
  const [isMac, setIsMac] = useState(false);
  const [activeProvider, setActiveProvider] = useState<LLMProvider>('groq');
  const [hasAnyKey, setHasAnyKey] = useState(false);
  const [currentHotkey, setCurrentHotkey] = useState(DEFAULT_ACCELERATOR);

  useEffect(() => {
    setIsMac(navigator.userAgent.includes('Mac'));

    const loadSettings = async () => {
      const [provider, hotkey] = await Promise.all([
        window.electron.getActiveProvider(),
        window.electron.getHotkey()
      ]);
      setActiveProvider(provider);
      setCurrentHotkey(hotkey);

      const checks = await Promise.all(PROVIDERS.map((p) => window.electron.hasApiKey(p.id)));
      setHasAnyKey(checks.some(Boolean));
    };
    loadSettings();
  }, []);

  const handleActivate = async (provider: LLMProvider) => {
    await window.electron.setActiveProvider(provider);
    setActiveProvider(provider);
  };

  const refreshKeyStatus = useCallback(async () => {
    const checks = await Promise.all(PROVIDERS.map((p) => window.electron.hasApiKey(p.id)));
    setHasAnyKey(checks.some(Boolean));
  }, []);

  useEffect(() => {
    const interval = setInterval(refreshKeyStatus, 2000);
    return () => clearInterval(interval);
  }, [refreshKeyStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-y-auto">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tr from-blue-400 to-cyan-400 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-gradient-to-bl from-green-400 to-emerald-400 rounded-full opacity-10 blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full mx-auto px-8 py-10">
        <div className="bg-white/[0.06] backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/[0.1] text-center">
          {/* Header */}
          <div className="mb-10">
            <div className="flex justify-center mb-6">
              <div className="rounded-2xl bg-white/10 px-6 py-3 inline-flex items-center justify-center">
                <img
                  src="/logo.svg"
                  alt="Reword"
                  className="h-16 w-auto object-contain"
                />
              </div>
            </div>
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Transform your text into professional, formal, or funny variations with the power of
              AI
            </p>
          </div>

          {/* Provider API Keys */}
          <div className="mb-10">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white/50"
                >
                  <path
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h2 className="text-lg font-semibold text-white">LLM Providers</h2>
                <span className="text-xs text-white/40">
                  Add your API key and select which provider to use
                </span>
              </div>
              <div className="space-y-3">
                {PROVIDERS.map((provider) => (
                  <ProviderKeyRow
                    key={provider.id}
                    provider={provider}
                    isActive={activeProvider === provider.id}
                    onActivate={() => handleActivate(provider.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Keyboard Shortcut */}
          <div className="mb-10">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white/50"
                >
                  <rect
                    x="2"
                    y="6"
                    width="20"
                    height="12"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path d="M6 10h2m2 0h2m2 0h2m2 0h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M8 14h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <h2 className="text-lg font-semibold text-white">Keyboard Shortcut</h2>
                <span className="text-xs text-white/40">
                  Customize the global shortcut to trigger the rephraser
                </span>
              </div>
              <HotkeyRecorder
                currentHotkey={currentHotkey}
                isMac={isMac}
                onHotkeyChanged={setCurrentHotkey}
              />
            </div>
          </div>

          {/* How to use */}
          <div className="mb-10">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30 max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-white mb-4">How to Use</h2>
              <div className="space-y-4 text-left">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <p className="text-white/80">Select any text on your screen</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <p className="text-white/80">
                    Press{' '}
                    <kbd className="bg-white/20 px-3 py-1 rounded-lg text-sm font-mono">
                      {acceleratorToDisplay(currentHotkey, isMac)}
                    </kbd>
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <p className="text-white/80">Choose your preferred style and copy it!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:from-white/10 hover:to-white/15 transition-all duration-300">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-lg font-semibold text-white mb-2">Professional</h3>
              <p className="text-white/60 text-sm">
                Transform casual text into professional, business-appropriate language
              </p>
            </div>
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:from-white/10 hover:to-white/15 transition-all duration-300">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-white mb-2">Formal</h3>
              <p className="text-white/60 text-sm">Convert text into formal, official language</p>
            </div>
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:from-white/10 hover:to-white/15 transition-all duration-300">
              <div className="text-4xl mb-4">😄</div>
              <h3 className="text-lg font-semibold text-white mb-2">Funny</h3>
              <p className="text-white/60 text-sm">Add humor while keeping the original message</p>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center justify-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full animate-pulse ${hasAnyKey ? 'bg-emerald-400' : 'bg-amber-400'}`}
            ></div>
            <p className="text-white/60 text-sm">
              {hasAnyKey
                ? `Ready — using ${PROVIDERS.find((p) => p.id === activeProvider)?.name}`
                : 'Add an API key above to get started'}
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/40 text-sm">Powered by AI • Made with ❤️</p>
        </div>
      </div>
    </div>
  );
}

export default App;
