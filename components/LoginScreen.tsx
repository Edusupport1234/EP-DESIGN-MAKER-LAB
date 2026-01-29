import React, { useState } from 'react';
import { signInWithGoogle } from '../services/firebase';

const LoginScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "An error occurred during sign-in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f1ff] flex flex-col items-center justify-center p-6 relative overflow-hidden grid-bg">
      {/* Background blobs for depth and soft UI aesthetic */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[120px]"></div>
      
      {/* Floating Header Branding */}
      <div className="mb-8 flex flex-col items-center">
        <div className="w-16 h-16 bg-white rounded-3xl shadow-xl border border-white flex items-center justify-center mb-6">
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStOQQrCJ8rmaj-TLbkMU6TFRj2XsSLnDXzEQ&s" 
            className="w-10 h-10 object-contain" 
            alt="Logo" 
          />
        </div>
        <div className="bg-[#ffde59] text-slate-900 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm mb-4">
          Design Maker Lab
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight text-center max-w-sm">
          Welcome to the Future of Making
        </h1>
      </div>

      <div className="w-full max-w-[480px] bg-white rounded-[3.5rem] p-10 md:p-14 shadow-[0_40px_100px_rgba(99,102,241,0.06)] border border-white relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="space-y-8 relative z-10">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="student@makerlab.com"
                className="w-full px-7 py-5 bg-[#f8f7ff] border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••••••"
                className="w-full px-7 py-5 bg-[#f8f7ff] border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] px-1">
             <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded-lg border-slate-200 text-indigo-500 focus:ring-indigo-500" />
                <span className="text-slate-500 font-bold">Stay Logged In</span>
             </label>
             <button className="text-slate-900 font-black uppercase tracking-widest hover:text-indigo-600 transition-colors">Recover Account</button>
          </div>

          <div className="space-y-4 pt-4">
            <button 
              disabled={true}
              className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-800 transition-all opacity-40 cursor-not-allowed"
            >
              Sign In
            </button>

            <div className="relative py-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <span className="relative bg-white px-5 text-[10px] font-black text-slate-200 uppercase tracking-[0.3em]">or connect with</span>
            </div>

            <button 
              onClick={handleSignIn}
              disabled={loading}
              className="w-full py-5 px-6 bg-white text-slate-900 rounded-[2rem] font-black text-[11px] uppercase tracking-widest border border-slate-200 flex items-center justify-center gap-4 hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-50 shadow-sm"
            >
              {loading ? (
                <i className="fa-solid fa-circle-notch animate-spin"></i>
              ) : (
                <>
                  <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                  Sign in with Google
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl animate-in fade-in duration-300">
              <p className="text-xs text-rose-600 font-bold text-center leading-tight">{error}</p>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-12 text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-8">
        <span>EST. 2024</span>
        <div className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse"></div>
        <span>SYSTEM ALPHA V4</span>
      </footer>
    </div>
  );
};

export default LoginScreen;