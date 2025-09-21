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

  const closeWindow = () => {
    window.close();
  };

  useEffect(() => {
    // Subscribe to getCopyText events
    const unsubscribe = window.electron.subscribeToGetRephrasedText((data) => {
      console.log('data', data);
      setReceivedText(data);
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
      unsubscribe();
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden bg-black bg-opacity-80">
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 max-w-sm w-[90%] text-center shadow-2xl border border-white border-opacity-10 backdrop-blur-lg animate-bounce-in">
        <h2 className="text-xl font-semibold mb-3 text-white">📋 Selected Text Captured!</h2>
        {receivedText ? (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2 text-white opacity-90">Selected Text:</p>
            <div className="bg-white bg-opacity-20 rounded-md p-3 mb-3 max-h-32 overflow-y-auto">
              <p className="text-sm break-words">{receivedText.original}</p>
              <p className="text-sm break-words">{receivedText.polite}</p>
              <p className="text-sm break-words">{receivedText.professional}</p>
              <p className="text-sm break-words">{receivedText.funny}</p>
            </div>
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
