import React, { useEffect } from 'react';

export function PopApp(): React.JSX.Element {
  const closeWindow = () => {
    window.close();
  };

  useEffect(() => {
    // Close on Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeWindow();
      }
    };

    // Auto-close after 3 seconds
    const autoCloseTimer = setTimeout(() => {
      closeWindow();
    }, 3000);

    // Close when clicking outside the popup
    const handleClick = (e: MouseEvent) => {
      if (e.target === document.body) {
        closeWindow();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
      clearTimeout(autoCloseTimer);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden bg-black bg-opacity-80">
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 max-w-sm w-[90%] text-center shadow-2xl border border-white border-opacity-10 backdrop-blur-lg animate-bounce-in">
        <h2 className="text-xl font-semibold mb-3 text-white">🚀 Shortcut Activated!</h2>
        <p className="text-sm leading-relaxed mb-2 text-white opacity-90">
          Global shortcut triggered successfully
        </p>
        <p className="text-xs opacity-70 mb-5 text-white">Ctrl+Shift+C (Cmd+Shift+C on Mac)</p>
        <button
          onClick={closeWindow}
          className="bg-white bg-opacity-20 border border-white border-opacity-30 text-white px-4 py-2 rounded-md cursor-pointer text-sm transition-all duration-200 hover:bg-opacity-30 hover:-translate-y-0.5 active:translate-y-0"
        >
          Close
        </button>
      </div>
    </div>
  );
}
