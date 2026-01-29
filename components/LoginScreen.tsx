
import React, { useState } from 'react';
import { signInWithGoogle } from '../services/firebase';

const LoginScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithGoogle();
      console.log('User signed in:', result.user);
    } catch (err: any) {
      console.error('Sign-in error:', err);
      if (err.code === 'auth/unauthorized-domain' || err.message?.includes('unauthorized-domain')) {
        setError("auth/unauthorized-domain");
      } else {
        setError(err.message || "An error occurred during sign-in.");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyDomain = () => {
    navigator.clipboard.writeText(window.location.hostname);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDomainError = error === "auth/unauthorized-domain";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,#eef2ff_0%,#ffffff_100%)]">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      </div>
      
      {/* Top Badge */}
      <div className="mb-4 bg-amber-100 text-amber-900 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm">
        Maker Lab Login
      </div>

      <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-12 tracking-tight">
        Welcome Design Maker Lab!
      </h1>

      <div className="w-full max-w-[480px] bg-white rounded-[2.5rem] p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        {!isDomainError ? (
          <div className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="name@institution.edu"
                  className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all text-sm font-medium placeholder:text-slate-300"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">
                   <i className="fa-solid fa-envelope"></i>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="••••••••••••"
                  className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all text-sm font-medium placeholder:text-slate-300"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">
                   <i className="fa-solid fa-lock"></i>
                </div>
              </div>
            </div>

            {/* Options Row */}
            <div className="flex items-center justify-between text-sm px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                <span className="text-slate-500 font-medium group-hover:text-slate-700 transition-colors">Remember me</span>
              </label>
              <button className="text-slate-900 font-bold hover:text-indigo-600 transition-colors">Forgot password?</button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-4">
              <button 
                disabled={true}
                className="w-full py-5 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all opacity-50 cursor-not-allowed"
              >
                Create an Account
              </button>

              <div className="relative py-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <span className="relative bg-white px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">or</span>
              </div>

              <button 
                onClick={handleSignIn}
                disabled={loading}
                className="w-full py-4 px-6 bg-white text-slate-900 rounded-2xl font-bold text-sm border border-slate-200 flex items-center justify-center gap-3 hover:bg-slate-50 active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm"
              >
                {loading ? (
                  <i className="fa-solid fa-circle-notch animate-spin"></i>
                ) : (
                  <>
                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                    Continue with Google
                  </>
                )}
              </button>
            </div>

            {error && !isDomainError && (
              <div className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl animate-in fade-in duration-300">
                <p className="text-xs text-rose-600 font-bold text-center leading-tight">{error}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full space-y-6 animate-in zoom-in-95 duration-300">
            <div className="p-8 bg-amber-50 border border-amber-100 rounded-[2rem] text-left">
              <div className="flex items-center gap-3 text-amber-600 mb-4">
                <i className="fa-solid fa-triangle-exclamation text-xl"></i>
                <h3 className="text-xs font-black uppercase tracking-widest">Configuration Required</h3>
              </div>
              
              <p className="text-xs text-slate-600 leading-relaxed mb-6 font-medium">
                This domain needs to be whitelisted in Firebase console settings.
              </p>

              <div className="space-y-5">
                <div 
                  onClick={copyDomain}
                  className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between group cursor-pointer hover:border-indigo-400 transition-all"
                >
                  <code className="text-xs text-indigo-600 font-mono truncate mr-2">{window.location.hostname}</code>
                  <div className="shrink-0">
                    {copied ? (
                      <i className="fa-solid fa-check text-emerald-500 text-sm"></i>
                    ) : (
                      <i className="fa-solid fa-copy text-slate-300 text-sm group-hover:text-indigo-400"></i>
                    )}
                  </div>
                </div>

                <a 
                  href="https://console.firebase.google.com/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="block w-full text-center py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all"
                >
                  Firebase Console
                </a>
              </div>
            </div>

            <button 
              onClick={() => setError(null)}
              className="w-full py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-colors"
            >
              <i className="fa-solid fa-rotate-left mr-2"></i>
              Back to login
            </button>
          </div>
        )}
      </div>

      <footer className="mt-12 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-4">
        <span>© 2024 Lab Environment</span>
        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
        <span>Secure Protocol 4.0</span>
      </footer>
    </div>
  );
};

export default LoginScreen;
