import React, { useEffect, useState, useCallback } from 'react';

type ToneKey =
  | 'professional'
  | 'formal'
  | 'funny'
  | 'casual'
  | 'friendly'
  | 'persuasive'
  | 'concise';

interface ToneOption {
  key: ToneKey;
  label: string;
  icon: string;
  description: string;
  accent: string;
  bgHover: string;
  iconBg: string;
}

const TONES: ToneOption[] = [
  {
    key: 'professional',
    label: 'Professional',
    icon: '💼',
    description: 'Business appropriate',
    accent: 'from-blue-400 to-indigo-400',
    bgHover: 'hover:border-blue-400/30',
    iconBg: 'from-blue-500/20 to-indigo-500/20'
  },
  {
    key: 'formal',
    label: 'Formal',
    icon: '📋',
    description: 'Official & polished',
    accent: 'from-violet-400 to-purple-400',
    bgHover: 'hover:border-violet-400/30',
    iconBg: 'from-violet-500/20 to-purple-500/20'
  },
  {
    key: 'casual',
    label: 'Casual',
    icon: '☕',
    description: 'Relaxed & natural',
    accent: 'from-teal-400 to-cyan-400',
    bgHover: 'hover:border-teal-400/30',
    iconBg: 'from-teal-500/20 to-cyan-500/20'
  },
  {
    key: 'friendly',
    label: 'Friendly',
    icon: '👋',
    description: 'Warm & approachable',
    accent: 'from-pink-400 to-rose-400',
    bgHover: 'hover:border-pink-400/30',
    iconBg: 'from-pink-500/20 to-rose-500/20'
  },
  {
    key: 'funny',
    label: 'Funny',
    icon: '😄',
    description: 'Witty & humorous',
    accent: 'from-amber-400 to-orange-400',
    bgHover: 'hover:border-amber-400/30',
    iconBg: 'from-amber-500/20 to-orange-500/20'
  },
  {
    key: 'persuasive',
    label: 'Persuasive',
    icon: '🎯',
    description: 'Compelling & convincing',
    accent: 'from-red-400 to-rose-400',
    bgHover: 'hover:border-red-400/30',
    iconBg: 'from-red-500/20 to-rose-500/20'
  },
  {
    key: 'concise',
    label: 'Concise',
    icon: '✂️',
    description: 'Short & to the point',
    accent: 'from-emerald-400 to-green-400',
    bgHover: 'hover:border-emerald-400/30',
    iconBg: 'from-emerald-500/20 to-green-500/20'
  }
];

type AppState = 'waiting' | 'selecting' | 'loading' | 'result';

export function PopApp(): React.JSX.Element {
  const [state, setState] = useState<AppState>('waiting');
  const [originalText, setOriginalText] = useState('');
  const [selectedTone, setSelectedTone] = useState<ToneKey | null>(null);
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const closeWindow = useCallback(() => {
    window.electron.closeWindow();
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleToneSelect = async (tone: ToneKey) => {
    setSelectedTone(tone);
    setState('loading');
    setError(null);

    try {
      const response = await window.electron.rephraseWithTone(originalText, tone);
      if (response.success && response.data) {
        setResult(response.data.result);
        setState('result');
      } else {
        setError(response.error || 'Failed to rephrase text');
        setState('selecting');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setState('selecting');
    }
  };

  const handleTryAnother = () => {
    setState('selecting');
    setResult('');
    setCopied(false);
    setSelectedTone(null);
  };

  useEffect(() => {
    const unsubscribeProcessing = window.electron.subscribeToProcessingStarted((data) => {
      setOriginalText(data.originalText);
      setState('selecting');
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeWindow();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      unsubscribeProcessing();
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeWindow]);

  const activeTone = TONES.find((t) => t.key === selectedTone);

  const headerSubtitle = () => {
    switch (state) {
      case 'waiting':
        return 'Waiting for text selection...';
      case 'selecting':
        return 'Choose a tone for your text';
      case 'loading':
        return 'Rephrasing your text...';
      case 'result':
        return 'Click to copy the result';
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-indigo-500/8 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-gradient-to-t from-purple-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl mx-auto scrollbar-auto-hide overflow-y-auto max-h-screen">
        <div className="p-6 pb-4 animate-bounce-in">
          <div className="bg-white/[0.03] backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                    <span className="text-lg">{state === 'loading' ? '⚡' : '✨'}</span>
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-white/95 tracking-tight">
                      Text Rephraser
                    </h1>
                  </div>
                </div>
                <button
                  onClick={closeWindow}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-all duration-200"
                  title="Close (Esc)"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M1 1L13 13M1 13L13 1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-white/40 ml-12">{headerSubtitle()}</p>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

            {state === 'waiting' ? (
              <div className="px-6 py-14 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/[0.08] mb-5">
                  <div className="animate-smooth-spin w-6 h-6 border-2 border-white/15 border-t-indigo-400/60 rounded-full" />
                </div>
                <p className="text-base font-medium text-white/70 mb-1.5">Waiting for text...</p>
                <p className="text-sm text-white/35">Select text and trigger the shortcut</p>
              </div>
            ) : (
              <div className="px-6 py-5">
                {/* Original text */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-xs font-medium uppercase tracking-wider text-white/30">
                      Original
                    </span>
                    <div className="flex-1 h-px bg-white/[0.06]" />
                  </div>
                  <div className="bg-white/[0.03] rounded-xl px-4 py-3 border border-white/[0.06]">
                    <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
                      {originalText}
                    </p>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-400/20">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}

                {/* Tone selection grid */}
                {state === 'selecting' && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium uppercase tracking-wider text-white/30">
                        Select Tone
                      </span>
                      <div className="flex-1 h-px bg-white/[0.06]" />
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {TONES.map((tone, i) => (
                        <button
                          key={tone.key}
                          onClick={() => handleToneSelect(tone.key)}
                          className={`
                            animate-fade-up group relative text-left rounded-xl
                            border border-white/[0.06] bg-white/[0.02]
                            hover:bg-white/[0.06] ${tone.bgHover}
                            transition-all duration-200 ease-out p-3.5
                          `}
                          style={{ animationDelay: `${i * 50}ms` }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-lg bg-gradient-to-br ${tone.iconBg} border border-white/10 flex items-center justify-center flex-shrink-0`}
                            >
                              <span className="text-lg">{tone.icon}</span>
                            </div>
                            <div className="min-w-0">
                              <span
                                className={`text-sm font-semibold bg-gradient-to-r ${tone.accent} bg-clip-text text-transparent block`}
                              >
                                {tone.label}
                              </span>
                              <span className="text-xs text-white/35">{tone.description}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Loading state */}
                {state === 'loading' && activeTone && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium uppercase tracking-wider text-white/30">
                        Rephrasing
                      </span>
                      <div className="flex-1 h-px bg-white/[0.06]" />
                    </div>
                    <div className="animate-fade-up rounded-xl border border-white/[0.06] p-4 animate-shimmer">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-9 h-9 rounded-lg bg-gradient-to-br ${activeTone.iconBg} border border-white/10 flex items-center justify-center`}
                        >
                          <span className="text-lg">{activeTone.icon}</span>
                        </div>
                        <span
                          className={`text-sm font-semibold bg-gradient-to-r ${activeTone.accent} bg-clip-text text-transparent`}
                        >
                          {activeTone.label}
                        </span>
                      </div>
                      <div className="space-y-2 pl-12">
                        <div className="h-3 bg-white/[0.04] rounded-md w-full" />
                        <div className="h-3 bg-white/[0.04] rounded-md w-4/5" />
                        <div className="h-3 bg-white/[0.04] rounded-md w-3/5" />
                      </div>
                    </div>
                    <div className="text-center pt-4">
                      <div className="inline-flex items-center gap-2.5 text-white/40 text-sm">
                        <div className="animate-smooth-spin w-4 h-4 border-2 border-white/20 border-t-indigo-400/70 rounded-full" />
                        <span>Processing with AI...</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Result state */}
                {state === 'result' && activeTone && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium uppercase tracking-wider text-white/30">
                        Result
                      </span>
                      <div className="flex-1 h-px bg-white/[0.06]" />
                    </div>
                    <button
                      onClick={() => copyToClipboard(result)}
                      className={`
                        animate-fade-up group relative w-full text-left rounded-xl
                        border transition-all duration-300 ease-out p-4
                        ${
                          copied
                            ? 'border-emerald-400/40 bg-emerald-500/[0.08]'
                            : `border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] ${activeTone.bgHover}`
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div
                            className={`w-9 h-9 rounded-lg bg-gradient-to-br ${activeTone.iconBg} border border-white/10 flex items-center justify-center`}
                          >
                            <span className="text-lg">{activeTone.icon}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span
                              className={`text-sm font-semibold bg-gradient-to-r ${activeTone.accent} bg-clip-text text-transparent`}
                            >
                              {activeTone.label}
                            </span>
                            {copied && (
                              <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                  <path
                                    d="M2 6L5 9L10 3"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                Copied
                              </span>
                            )}
                          </div>
                          <p className="text-white/75 text-sm leading-relaxed">{result}</p>
                        </div>
                        <div className="flex-shrink-0 mt-0.5">
                          {copied ? (
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path
                                  d="M2 7L5.5 10.5L12 3.5"
                                  stroke="#34d399"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                className="text-white/50"
                              >
                                <rect
                                  x="4"
                                  y="4"
                                  width="8"
                                  height="8"
                                  rx="1.5"
                                  stroke="currentColor"
                                  strokeWidth="1.2"
                                />
                                <path
                                  d="M10 4V2.5C10 1.67 9.33 1 8.5 1H2.5C1.67 1 1 1.67 1 2.5V8.5C1 9.33 1.67 10 2.5 10H4"
                                  stroke="currentColor"
                                  strokeWidth="1.2"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Try another tone button */}
                    <div className="mt-4 text-center">
                      <button
                        onClick={handleTryAnother}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/50 hover:text-white/80 hover:bg-white/[0.08] transition-all duration-200 text-sm"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path
                            d="M1 7C1 3.68629 3.68629 1 7 1C9.22222 1 11.1404 2.25137 12.0868 4.1M13 7C13 10.3137 10.3137 13 7 13C4.77778 13 2.85959 11.7486 1.91325 9.9"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                          />
                          <path
                            d="M12 1.5V4.5H9"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2 12.5V9.5H5"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Try another tone
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="px-6 py-3 border-t border-white/[0.05]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/25">
                  <kbd className="bg-white/[0.06] border border-white/[0.08] px-1.5 py-0.5 rounded text-[10px] font-mono">
                    Esc
                  </kbd>{' '}
                  to close
                </span>
                <span className="text-xs text-white/20">Powered by AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
