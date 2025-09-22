import React, { useEffect, useState } from 'react';

export function PopApp(): React.JSX.Element {
  const [receivedText, setReceivedText] = useState<{
    funny: string;
    polite: string;
    professional: string;
    original: string;
  }>({
    funny: '',
    polite: '',
    professional: '',
    original: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasStartedProcessing, setHasStartedProcessing] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const closeWindow = () => {
    window.electron.closeWindow();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      // Clear the copied state after 2 seconds
      setTimeout(() => setCopiedText(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  useEffect(() => {
    // Subscribe to processing started events
    const unsubscribeProcessing = window.electron.subscribeToProcessingStarted((data) => {
      console.log('Processing started for text:', data.originalText);
      setIsLoading(true);
      setHasStartedProcessing(true);
      setReceivedText({
        original: data.originalText,
        funny: '',
        polite: '',
        professional: ''
      });
    });

    // Subscribe to getCopyText events
    const unsubscribeResults = window.electron.subscribeToGetRephrasedText((data) => {
      console.log('data', data);
      setReceivedText(data);
      setIsLoading(false);
    });

    // Close on Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeWindow();
      }
    };

    // Auto-close timer removed - window stays open until manually closed

    // Close when clicking outside the popup
    const handleClick = (e: MouseEvent) => {
      if (e.target === document.body) {
        closeWindow();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick);

    return () => {
      unsubscribeProcessing();
      unsubscribeResults();
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-white/20 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-2xl -translate-y-8 translate-x-8"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400 to-cyan-400 rounded-full opacity-20 blur-2xl translate-y-4 -translate-x-4"></div>

        {/* Header */}
        <div className="relative z-10 text-center mb-8">
          <div className="text-4xl mb-3">{isLoading ? '🤖' : '✨'}</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {isLoading ? 'AI Processing' : 'Text Rephraser'}
          </h1>
          <p className="text-sm text-white/70">
            {isLoading
              ? 'Generating enhanced versions of your text...'
              : 'Choose a style and click to copy'}
          </p>
        </div>

        {hasStartedProcessing ? (
          <div className="relative z-10">
            {/* Original Text Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full mr-3"></div>
                <h3 className="text-lg font-semibold text-white">Original Text</h3>
              </div>
              <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <p className="text-white/90 leading-relaxed text-base">{receivedText.original}</p>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-purple-400 mx-auto mb-6"></div>
                  <div className="animate-pulse absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60"></div>
                </div>
                <p className="text-white/80 text-lg font-medium mb-2">
                  AI is crafting your text variations
                </p>
                <p className="text-white/60 text-sm">This usually takes just a few seconds...</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full mr-3"></div>
                  <h3 className="text-lg font-semibold text-white">Choose Your Style</h3>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => copyToClipboard(receivedText.professional)}
                    className={`group w-full bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transition-all duration-300 hover:from-white/10 hover:to-white/15 hover:border-white/20 hover:shadow-lg hover:scale-[1.02] ${
                      copiedText === receivedText.professional
                        ? 'from-emerald-500/20 to-green-500/20 border-emerald-400/50 shadow-emerald-500/25 shadow-lg'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="text-left flex-1">
                        <div className="flex items-center mb-3">
                          <span className="text-2xl mr-3">💼</span>
                          <h4 className="text-lg font-semibold text-white">Professional</h4>
                        </div>
                        <p className="text-white/90 leading-relaxed">{receivedText.professional}</p>
                      </div>
                      <div className="ml-4 flex flex-col items-center">
                        {copiedText === receivedText.professional ? (
                          <div className="bg-emerald-500/20 rounded-full p-2 mb-2">
                            <span className="text-emerald-300 text-xl">✓</span>
                          </div>
                        ) : (
                          <div className="bg-white/10 rounded-full p-2 mb-2 group-hover:bg-white/20 transition-colors">
                            <span className="text-white/60 text-xl">📋</span>
                          </div>
                        )}
                        <span
                          className={`text-xs font-medium ${
                            copiedText === receivedText.professional
                              ? 'text-emerald-300'
                              : 'text-white/60 group-hover:text-white/80'
                          }`}
                        >
                          {copiedText === receivedText.professional ? 'Copied!' : 'Click to copy'}
                        </span>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => copyToClipboard(receivedText.polite)}
                    className={`group w-full bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transition-all duration-300 hover:from-white/10 hover:to-white/15 hover:border-white/20 hover:shadow-lg hover:scale-[1.02] ${
                      copiedText === receivedText.polite
                        ? 'from-emerald-500/20 to-green-500/20 border-emerald-400/50 shadow-emerald-500/25 shadow-lg'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="text-left flex-1">
                        <div className="flex items-center mb-3">
                          <span className="text-2xl mr-3">🤝</span>
                          <h4 className="text-lg font-semibold text-white">Polite</h4>
                        </div>
                        <p className="text-white/90 leading-relaxed">{receivedText.polite}</p>
                      </div>
                      <div className="ml-4 flex flex-col items-center">
                        {copiedText === receivedText.polite ? (
                          <div className="bg-emerald-500/20 rounded-full p-2 mb-2">
                            <span className="text-emerald-300 text-xl">✓</span>
                          </div>
                        ) : (
                          <div className="bg-white/10 rounded-full p-2 mb-2 group-hover:bg-white/20 transition-colors">
                            <span className="text-white/60 text-xl">📋</span>
                          </div>
                        )}
                        <span
                          className={`text-xs font-medium ${
                            copiedText === receivedText.polite
                              ? 'text-emerald-300'
                              : 'text-white/60 group-hover:text-white/80'
                          }`}
                        >
                          {copiedText === receivedText.polite ? 'Copied!' : 'Click to copy'}
                        </span>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => copyToClipboard(receivedText.funny)}
                    className={`group w-full bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transition-all duration-300 hover:from-white/10 hover:to-white/15 hover:border-white/20 hover:shadow-lg hover:scale-[1.02] ${
                      copiedText === receivedText.funny
                        ? 'from-emerald-500/20 to-green-500/20 border-emerald-400/50 shadow-emerald-500/25 shadow-lg'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="text-left flex-1">
                        <div className="flex items-center mb-3">
                          <span className="text-2xl mr-3">😄</span>
                          <h4 className="text-lg font-semibold text-white">Funny</h4>
                        </div>
                        <p className="text-white/90 leading-relaxed">{receivedText.funny}</p>
                      </div>
                      <div className="ml-4 flex flex-col items-center">
                        {copiedText === receivedText.funny ? (
                          <div className="bg-emerald-500/20 rounded-full p-2 mb-2">
                            <span className="text-emerald-300 text-xl">✓</span>
                          </div>
                        ) : (
                          <div className="bg-white/10 rounded-full p-2 mb-2 group-hover:bg-white/20 transition-colors">
                            <span className="text-white/60 text-xl">📋</span>
                          </div>
                        )}
                        <span
                          className={`text-xs font-medium ${
                            copiedText === receivedText.funny
                              ? 'text-emerald-300'
                              : 'text-white/60 group-hover:text-white/80'
                          }`}
                        >
                          {copiedText === receivedText.funny ? 'Copied!' : 'Click to copy'}
                        </span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">⏳</div>
            <p className="text-xl font-medium text-white mb-2">Capturing selected text...</p>
            <p className="text-white/60">Please wait while we process your selection</p>
          </div>
        )}

        {/* Footer */}
        <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-xs text-white/50">
              Press <kbd className="bg-white/10 px-2 py-1 rounded text-xs">Esc</kbd> or click
              outside to close
            </p>
            <button
              onClick={closeWindow}
              className="bg-gradient-to-r from-white/10 to-white/20 backdrop-blur-sm border border-white/20 text-white px-6 py-2 rounded-xl transition-all duration-200 hover:from-white/20 hover:to-white/30 hover:border-white/30 hover:shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
