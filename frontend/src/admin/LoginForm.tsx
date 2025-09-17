import React, { useState, useEffect } from 'react';

interface LoginFormProps {
  onLogin: (userid: string, password: string) => void;
  error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, error }) => {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [viewportHeight, setViewportHeight] = useState('100vh');

  useEffect(() => {
    const updateHeight = () => {
      // For Android WebView compatibility, use multiple fallback strategies
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.clientHeight;
      
      // Use the most reliable height measurement
      const height = Math.max(windowHeight, documentHeight);
      setViewportHeight(`${height}px`);
      
      // Set CSS custom property for additional flexibility
      document.documentElement.style.setProperty('--app-height', `${height}px`);
    };

    // Initial height calculation
    updateHeight();

    // Listen for resize events (orientation changes, keyboard show/hide)
    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', () => {
      // Delay for orientation change completion
      setTimeout(updateHeight, 100);
    });

    // Android WebView specific events
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateHeight);
    }

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateHeight);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(userid, password);
  };

  return (
    <>
      {/* CSS for Android WebView compatibility */}
      <style>{`
        .android-webview-container {
          min-height: 100vh;
          min-height: 100dvh;
          min-height: var(--app-height, 100vh);
          height: auto;
          position: relative;
          overflow-x: hidden;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        
        .form-container {
          min-height: 0;
          flex-shrink: 0;
        }
        
        /* Ensure proper rendering on Android */
        @supports (-webkit-touch-callout: none) {
          .android-webview-container {
            min-height: -webkit-fill-available;
          }
        }
        
        /* Handle keyboard appearance on mobile */
        @media screen and (max-height: 500px) {
          .form-container {
            padding-top: 1rem;
            padding-bottom: 1rem;
          }
        }
      `}</style>
      
      <div 
        className="android-webview-container flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-2 sm:px-0" 
        style={{ 
          minHeight: viewportHeight,
          height: 'auto',
          position: 'relative'
        }}
      >
      <div className="w-full z-50 bg-gradient-to-r from-purple-600 to-blue-600 py-2 text-base font-semibold shadow-md overflow-hidden flex items-center min-h-12 flex-shrink-0">
        <span className="flex items-center justify-center h-full font-bold text-yellow-400 ml-6 flex-shrink-0 z-10 bg-yellow-100/20 rounded-full px-3 py-1 gap-2 shadow-sm border border-yellow-300/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M4.93 19h14.14c1.1 0 1.99-.9 1.99-2 0-.38-.11-.74-.3-1.04l-7.07-12.25a2 2 0 00-3.46 0L3.24 15.96A2 2 0 003.93 19z" />
          </svg>
          NOTICE:
        </span>
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="whitespace-nowrap animate-marquee text-white">
            Admin access only. Unauthorized attempts are prohibited.
          </div>
        </div>
      </div>
      <div className="form-container flex-1 flex items-center justify-center py-4 sm:py-8 min-h-0">
        <form
          onSubmit={handleSubmit}
          className="relative bg-white/10 backdrop-blur-xl p-4 sm:p-8 shadow-2xl w-full max-w-xs sm:max-w-sm border-2 border-transparent bg-clip-padding transition-all duration-300"
          style={{
            borderImage: 'linear-gradient(135deg, #6366f1 0%, #a21caf 100%) 1',
          }}
        >
        {/* Logo/avatar */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-0.5 sm:p-1 shadow-lg">
            <img
              src="https://i.ibb.co/60Jzx0KX/complete-0-EB4-EAC6-8-F81-4-A4-B-BA22-D1-CAE9933-FF6.png"
              alt="Admin Logo"
              className="w-full h-full rounded-full object-cover border-2 border-white/40 shadow"
            />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 sm:mb-6 text-center drop-shadow">Admin Login</h2>
        {error && <div className="mb-3 sm:mb-4 text-red-400 text-xs sm:text-sm text-center animate-pulse">{error}</div>}
        <div className="mb-3 sm:mb-4">
          <label className="block text-gray-200 mb-1 font-medium text-sm sm:text-base" htmlFor="userid">User ID</label>
          <input
            id="userid"
            type="text"
            value={userid}
            onChange={e => setUserid(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 rounded-lg bg-white/20 text-white border border-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/30 transition-all duration-200 placeholder-gray-300 shadow-inner text-sm sm:text-base"
            autoFocus
            required
            placeholder="Enter your user ID"
          />
        </div>
        <div className="mb-5 sm:mb-6">
          <label className="block text-gray-200 mb-1 font-medium text-sm sm:text-base" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 rounded-lg bg-white/20 text-white border border-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/30 transition-all duration-200 placeholder-gray-300 shadow-inner text-sm sm:text-base"
            required
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-2 rounded-lg shadow-lg transition-all duration-200 tracking-wide text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          Login
        </button>
        <a
          href="https://t.me/zikrulislam84"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center items-center mt-5 mb-2 hover:underline focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-400 drop-shadow mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 4v5c0 5.25-3.5 9.75-7 11-3.5-1.25-7-5.75-7-11V7l7-4z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v2m0 4h.01" />
          </svg>
          <span className="text-lg font-bold text-white">Get Admin Access</span>
        </a>
        </form>
      </div>
      </div>
    </>
  );
};

export default LoginForm; 