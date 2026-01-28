
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
      
      // Handle the specific unauthorized domain error with high-visibility guidance
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
    <div className="fixed inset-0 z-[100] bg-slate-900 flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:30px_30px]"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="glass-morphism bg-white/5 backdrop-blur-2xl rounded-[3rem] p-10 md:p-14 border border-white/10 shadow-2xl relative text-center">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-3xl shadow-2xl shadow-indigo-500/50 mb-8 mx-auto transform -rotate-6">
            <i className="fa-solid fa-flask-vial"></i>
          </div>

          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Design Maker Lab</h1>
          <p className="text-slate-400 text-sm font-medium mb-10 tracking-wide uppercase">Authorized Access Required</p>

          {!isDomainError ? (
            <div className="w-full space-y-6">
              <button 
                onClick={handleSignIn}
                disabled={loading}
                className="w-full py-4 px-6 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-slate-100 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin"></i>
                    Processing...
                  </>
                ) : (
                  <>
                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                    Sign in with Google
                  </>
                )}
              </button>

              <div className="p-5 bg-white/5 rounded-2xl border border-white/5 text-left">
                <div className="flex items-center gap-2 text-indigo-400 mb-2">
                  <i className="fa-solid fa-shield-halved"></i>
                  <span className="text-[10px] font-black uppercase tracking-widest">Lab Security</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                  Entrance is restricted to authorized student profiles. Please use your official institution email to gain access.
                </p>
              </div>

              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-[11px] text-rose-400 font-bold text-center leading-tight">{error}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full space-y-6 animate-in zoom-in-95 duration-300">
              <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-[2rem] text-left">
                <div className="flex items-center gap-3 text-amber-500 mb-4">
                  <i className="fa-solid fa-triangle-exclamation text-xl"></i>
                  <h3 className="text-xs font-black uppercase tracking-widest">Domain Authorization Required</h3>
                </div>
                
                <p className="text-[11px] text-slate-300 leading-relaxed mb-6 font-medium">
                  Firebase security prevents logins from this domain until it is whitelisted in your project settings.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center text-[10px] font-black shrink-0">1</div>
                    <p className="text-[10px] text-slate-400 font-medium">Copy your current hostname:</p>
                  </div>
                  
                  <div 
                    onClick={copyDomain}
                    className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-black/60 transition-all ml-10"
                  >
                    <code className="text-[10px] text-emerald-400 font-mono truncate mr-2">{window.location.hostname}</code>
                    <div className="shrink-0">
                      {copied ? (
                        <i className="fa-solid fa-check text-emerald-500 text-[10px]"></i>
                      ) : (
                        <i className="fa-solid fa-copy text-slate-500 text-[10px] group-hover:text-white"></i>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center text-[10px] font-black shrink-0">2</div>
                    <p className="text-[10px] text-slate-400 font-medium leading-tight">
                      Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-indigo-400 underline hover:text-indigo-300 font-black">Firebase Console</a> &gt; Authentication &gt; Settings &gt; Authorized Domains and add it.
                    </p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setError(null)}
                className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors"
              >
                <i className="fa-solid fa-rotate-left mr-2"></i>
                Try Again after whitelisting
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
