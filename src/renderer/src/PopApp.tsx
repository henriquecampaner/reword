import React, { useEffect, useState, useCallback } from 'react';

interface StyleVariant {
  key: 'professional' | 'formal' | 'funny';
  label: string;
  icon: string;
  accent: string;
  accentGlow: string;
  bgHover: string;
  iconBg: string;
}

const STYLE_VARIANTS: StyleVariant[] = [
  {
    key: 'professional',
    label: 'Professional',
    icon: '💼',
    accent: 'from-blue-400 to-indigo-400',
    accentGlow: 'shadow-blue-500/20',
    bgHover: 'hover:border-blue-400/30',
    iconBg: 'from-blue-500/20 to-indigo-500/20'
  },
  {
    key: 'formal',
    label: 'Formal',
    icon: '📋',
    accent: 'from-violet-400 to-purple-400',
    accentGlow: 'shadow-violet-500/20',
    bgHover: 'hover:border-violet-400/30',
    iconBg: 'from-violet-500/20 to-purple-500/20'
  },
  {
    key: 'funny',
    label: 'Funny',
    icon: '😄',
    accent: 'from-amber-400 to-orange-400',
    accentGlow: 'shadow-amber-500/20',
    bgHover: 'hover:border-amber-400/30',
    iconBg: 'from-amber-500/20 to-orange-500/20'
  }
];

export function PopApp(): React.JSX.Element {
  const [receivedText, setReceivedText] = useState<{
    funny: string;
    professional: string;
    formal: string;
    original: string;
  }>({
    funny: '',
    professional: '',
    formal: '',
    original: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasStartedProcessing, setHasStartedProcessing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const closeWindow = useCallback(() => {
    window.electron.closeWindow();
  }, []);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  useEffect(() => {
    const unsubscribeProcessing = window.electron.subscribeToProcessingStarted((data) => {
      setIsLoading(true);
      setHasStartedProcessing(true);
      setReceivedText({
        original: data.originalText,
        funny: '',
        professional: '',
        formal: ''
      });
    });

    const unsubscribeResults = window.electron.subscribeToGetRephrasedText((data) => {
      setReceivedText(data);
      setIsLoading(false);
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeWindow();
    };

    const handleClick = (e: MouseEvent) => {
      if (e.target === document.body) closeWindow();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick);

    return () => {
      unsubscribeProcessing();
      unsubscribeResults();
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
    };
  }, [closeWindow]);

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950">
      {/* Subtle ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-indigo-500/8 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-gradient-to-t from-purple-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Main scrollable area */}
      <div className="relative w-full max-w-2xl mx-auto scrollbar-auto-hide overflow-y-auto max-h-screen">
        <div className="p-6 pb-4 animate-bounce-in">
          {/* Compact glassmorphism container */}
          <div className="bg-white/[0.03] backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden">
            {/* Header - compact and clean */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                    <span className="text-lg">{isLoading ? '⚡' : '✨'}</span>
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
              <p className="text-sm text-white/40 ml-12">
                {isLoading
                  ? 'Generating variations...'
                  : hasStartedProcessing
                    ? 'Click any card to copy'
                    : 'Waiting for text selection...'}
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

            {hasStartedProcessing ? (
              <div className="px-6 py-5">
                {/* Original text - collapsible feel */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-xs font-medium uppercase tracking-wider text-white/30">
                      Original
                    </span>
                    <div className="flex-1 h-px bg-white/[0.06]" />
                  </div>
                  <div className="bg-white/[0.03] rounded-xl px-4 py-3 border border-white/[0.06]">
                    <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
                      {receivedText.original}
                    </p>
                  </div>
                </div>

                {isLoading ? (
                  /* Loading state - skeleton cards */
                  <div className="space-y-3">
                    {STYLE_VARIANTS.map((variant, i) => (
                      <div
                        key={variant.key}
                        className="animate-fade-up rounded-xl border border-white/[0.06] p-4 animate-shimmer"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
                            <span className="text-base opacity-40">{variant.icon}</span>
                          </div>
                          <div className="h-4 w-24 bg-white/[0.06] rounded-md" />
                        </div>
                        <div className="space-y-2 pl-11">
                          <div className="h-3 bg-white/[0.04] rounded-md w-full" />
                          <div className="h-3 bg-white/[0.04] rounded-md w-4/5" />
                          <div className="h-3 bg-white/[0.04] rounded-md w-3/5" />
                        </div>
                      </div>
                    ))}

                    <div className="text-center pt-2">
                      <div className="inline-flex items-center gap-2.5 text-white/40 text-sm">
                        <div className="animate-smooth-spin w-4 h-4 border-2 border-white/20 border-t-indigo-400/70 rounded-full" />
                        <span>Processing with AI...</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Result cards */
                  <div className="space-y-3">
                    {STYLE_VARIANTS.map((variant, i) => {
                      const text = receivedText[variant.key];
                      const isCopied = copiedKey === variant.key;

                      return (
                        <button
                          key={variant.key}
                          onClick={() => copyToClipboard(text, variant.key)}
                          className={`
                            animate-fade-up group relative w-full text-left rounded-xl
                            border transition-all duration-300 ease-out p-4
                            ${
                              isCopied
                                ? 'border-emerald-400/40 bg-emerald-500/[0.08]'
                                : `border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] ${variant.bgHover}`
                            }
                          `}
                          style={{ animationDelay: `${i * 80}ms` }}
                        >
                          <div className="flex items-start gap-3">
                            {/* Icon + label */}
                            <div className="flex-shrink-0">
                              <div
                                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${variant.iconBg} border border-white/10 flex items-center justify-center`}
                              >
                                <span className="text-base">{variant.icon}</span>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span
                                  className={`text-sm font-semibold bg-gradient-to-r ${variant.accent} bg-clip-text text-transparent`}
                                >
                                  {variant.label}
                                </span>
                                {isCopied && (
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
                              <p className="text-white/75 text-sm leading-relaxed">{text}</p>
                            </div>

                            {/* Copy indicator */}
                            <div className="flex-shrink-0 mt-0.5">
                              {isCopied ? (
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
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Waiting state */
              <div className="px-6 py-14 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/[0.08] mb-5">
                  <div className="animate-smooth-spin w-6 h-6 border-2 border-white/15 border-t-indigo-400/60 rounded-full" />
                </div>
                <p className="text-base font-medium text-white/70 mb-1.5">Waiting for text...</p>
                <p className="text-sm text-white/35">Select text and trigger the shortcut</p>
              </div>
            )}

            {/* Footer - minimal */}
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
