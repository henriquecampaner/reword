import React, { useState, useEffect } from 'react';
import './index.css';

function App(): React.JSX.Element {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    // Detect if user is on Mac
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

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
              Transform your text into professional, polite, or funny variations with the power of
              AI
            </p>
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
                Transform casual text into business-appropriate language
              </p>
            </div>
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:from-white/10 hover:to-white/15 transition-all duration-300">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-lg font-semibold text-white mb-2">Polite</h3>
              <p className="text-white/60 text-sm">Make your text more courteous and respectful</p>
            </div>
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:from-white/10 hover:to-white/15 transition-all duration-300">
              <div className="text-4xl mb-4">😄</div>
              <h3 className="text-lg font-semibold text-white mb-2">Funny</h3>
              <p className="text-white/60 text-sm">Add humor while keeping the original message</p>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center justify-center space-x-3">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <p className="text-white/60 text-sm">Ready to transform your text</p>
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
