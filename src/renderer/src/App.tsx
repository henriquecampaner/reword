import React, { useState, useEffect } from 'react';
import './index.css';

function App(): React.JSX.Element {
  const [isMac, setIsMac] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [maskedKey, setMaskedKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsMac(navigator.userAgent.includes('Mac'));

    const loadSettings = async () => {
      const exists = await window.electron.hasApiKey();
      setHasKey(exists);
      if (exists) {
        const masked = await window.electron.getApiKey();
        setMaskedKey(masked);
      }
    };
    loadSettings();
  }, []);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) return;
    setIsSaving(true);
    try {
      await window.electron.setApiKey(apiKey.trim());
      setHasKey(true);
      const masked = await window.electron.getApiKey();
      setMaskedKey(masked);
      setApiKey('');
      setIsEditing(false);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveApiKey();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tr from-blue-400 to-cyan-400 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-gradient-to-bl from-green-400 to-emerald-400 rounded-full opacity-10 blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* Main content card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20 text-center">
          {/* Header */}
          <div className="mb-12">
            <div className="text-7xl mb-6 animate-bounce">✨</div>
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Text Rephraser
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Transform your text into professional, formal, or funny variations with the power of AI
            </p>
          </div>

          {/* API Key Settings */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-indigo-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-6 border border-indigo-400/30 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/30 to-blue-500/30 border border-white/10 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-indigo-300">
                    <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-base font-semibold text-white">Groq API Key</h3>
                  <p className="text-xs text-white/50">
                    Get your key at{' '}
                    <span className="text-indigo-300/80">console.groq.com</span>
                  </p>
                </div>
                {hasKey && !isEditing && (
                  <div className="ml-auto flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span className="text-xs text-emerald-400/80">Connected</span>
                    </div>
                  </div>
                )}
              </div>

              {hasKey && !isEditing ? (
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-left">
                    <span className="text-white/50 text-sm font-mono tracking-wider">{maskedKey}</span>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-medium"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="gsk_..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-indigo-400/50 focus:ring-1 focus:ring-indigo-400/25 transition-all duration-200"
                    autoFocus={isEditing}
                  />
                  <button
                    onClick={handleSaveApiKey}
                    disabled={isSaving || !apiKey.trim()}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-sm font-medium hover:from-indigo-400 hover:to-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Save'
                    )}
                  </button>
                  {isEditing && (
                    <button
                      onClick={() => { setIsEditing(false); setApiKey(''); }}
                      className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}

              {saveStatus === 'saved' && (
                <div className="mt-3 flex items-center gap-2 text-emerald-400 text-sm">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  API key saved successfully
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="mt-3 text-red-400 text-sm">
                  Failed to save API key. Please try again.
                </div>
              )}
            </div>
          </div>

          {/* Main instruction */}
          <div className="mb-12">
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
                      {isMac ? 'Cmd+Shift+C' : 'Ctrl+Shift+C'}
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
          <div className="grid md:grid-cols-3 gap-6 mb-12">
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
            <div className={`w-3 h-3 rounded-full animate-pulse ${hasKey ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
            <p className="text-white/60 text-sm">
              {hasKey ? 'Ready to transform your text' : 'Add your API key above to get started'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/40 text-sm">Powered by AI • Made with ❤️</p>
        </div>
      </div>
    </div>
  );
}

export default App;
