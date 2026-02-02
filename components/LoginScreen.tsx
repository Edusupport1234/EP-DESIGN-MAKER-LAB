
import React, { useState } from 'react';
import { signInWithGoogle } from '../services/firebase';

interface LoginScreenProps {
  onBack?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onBack }) => {
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
    <div className="fixed inset-0 z-[200] bg-indigo-900/40 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-in fade-in duration-500 overflow-hidden">
      {/* Background blobs for depth and soft UI aesthetic */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[120px]"></div>
      
      {/* Floating Header Branding */}
      <div className="mb-8 flex flex-col items-center relative z-10">
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
        <h1 className="text-4xl font-black text-white tracking-tight text-center max-w-sm">
          Welcome to the Future of Making
        </h1>
      </div>

      <div className="w-full max-w-[480px] bg-white rounded-[3.5rem] p-10 md:p-14 shadow-[0_40px_100px_rgba(0,0,0,0.2)] border border-white relative overflow-hidden animate-in slide-in-from-bottom-8 duration-700">
        
        <div className="space-y-8 relative z-10">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Credentials</label>
              <p className="text-xs text-slate-500 font-medium px-1">Please use the secure Google authentication portal to access the staff console.</p>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <button 
              onClick={handleSignIn}
              disabled={loading}
              className="w-full py-6 px-6 bg-slate-950 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50 shadow-2xl"
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

            {onBack && (
              <button 
                onClick={onBack}
                className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-indigo-600 transition-colors"
              >
                Continue as Guest Viewer
              </button>
            )}
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl animate-in fade-in duration-300">
              <p className="text-xs text-rose-600 font-bold text-center leading-tight">{error}</p>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-12 text-white/40 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-8 relative z-10">
        <span>EST. 2024</span>
        <div className="w-2 h-2 bg-white/20 rounded-full"></div>
        <span>SECURE LOGIN SYSTEM</span>
      </footer>
    </div>
  );
};

export default LoginScreen;
