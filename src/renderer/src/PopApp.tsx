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
    window.close();
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
    <div className="min-h-screen flex items-center justify-center overflow-hidden bg-black bg-opacity-80">
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 max-w-sm w-[90%] text-center shadow-2xl border border-white border-opacity-10 backdrop-blur-lg animate-bounce-in">
        <h2 className="text-xl font-semibold mb-3 text-white">
          {isLoading ? '🤖 AI Processing...' : '📋 Selected Text Captured!'}
        </h2>

        {hasStartedProcessing ? (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2 text-white opacity-90">Original Text:</p>
            <div className="bg-white bg-opacity-20 rounded-md p-3 mb-3 max-h-32 overflow-y-auto">
              <p className="text-sm break-words">{receivedText.original}</p>
            </div>

            {isLoading ? (
              <div className="mb-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <p className="text-sm text-white opacity-90">
                    AI is generating rephrased versions...
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => copyToClipboard(receivedText.professional)}
                  className={`w-full bg-white bg-opacity-20 rounded-md p-3 hover:bg-opacity-30 transition-all duration-200 cursor-pointer border border-white border-opacity-20 hover:border-opacity-40 ${
                    copiedText === receivedText.professional
                      ? 'bg-green-500 bg-opacity-30 border-green-400'
                      : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="text-left flex-1">
                      <p className="text-xs font-medium opacity-70 mb-1">Professional:</p>
                      <p className="text-sm break-words">{receivedText.professional}</p>
                    </div>
                    <div className="ml-2">
                      {copiedText === receivedText.professional ? (
                        <span className="text-green-300 text-xs">✓ Copied!</span>
                      ) : (
                        <span className="text-white opacity-50 text-xs">📋 Click to copy</span>
                      )}
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => copyToClipboard(receivedText.polite)}
                  className={`w-full bg-white bg-opacity-20 rounded-md p-3 hover:bg-opacity-30 transition-all duration-200 cursor-pointer border border-white border-opacity-20 hover:border-opacity-40 ${
                    copiedText === receivedText.polite
                      ? 'bg-green-500 bg-opacity-30 border-green-400'
                      : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="text-left flex-1">
                      <p className="text-xs font-medium opacity-70 mb-1">Polite:</p>
                      <p className="text-sm break-words">{receivedText.polite}</p>
                    </div>
                    <div className="ml-2">
                      {copiedText === receivedText.polite ? (
                        <span className="text-green-300 text-xs">✓ Copied!</span>
                      ) : (
                        <span className="text-white opacity-50 text-xs">📋 Click to copy</span>
                      )}
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => copyToClipboard(receivedText.funny)}
                  className={`w-full bg-white bg-opacity-20 rounded-md p-3 hover:bg-opacity-30 transition-all duration-200 cursor-pointer border border-white border-opacity-20 hover:border-opacity-40 ${
                    copiedText === receivedText.funny
                      ? 'bg-green-500 bg-opacity-30 border-green-400'
                      : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="text-left flex-1">
                      <p className="text-xs font-medium opacity-70 mb-1">Funny:</p>
                      <p className="text-sm break-words">{receivedText.funny}</p>
                    </div>
                    <div className="ml-2">
                      {copiedText === receivedText.funny ? (
                        <span className="text-green-300 text-xs">✓ Copied!</span>
                      ) : (
                        <span className="text-white opacity-50 text-xs">📋 Click to copy</span>
                      )}
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-sm leading-relaxed mb-2 text-white opacity-90">
              Capturing selected text...
            </p>
          </div>
        )}
        <p className="text-xs opacity-70 mb-5 text-white">Ctrl+Shift+C (Cmd+Shift+C on Mac)</p>
        <button
          onClick={closeWindow}
          className="bg-white bg-opacity-20 border border-white border-opacity-30 text-base px-4 py-2 rounded-md cursor-pointer transition-all duration-200 hover:bg-opacity-30 hover:-translate-y-0.5 active:translate-y-0"
        >
          Close
        </button>
      </div>
    </div>
  );
}
