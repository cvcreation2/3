import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, Check } from 'lucide-react';

interface LoginProps {
  onLogin: (remember: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Branding State
  const [appName, setAppName] = useState('Nexus VPN');
  const [appLogo, setAppLogo] = useState<string | null>(null);

  useEffect(() => {
      setAppName(localStorage.getItem('nexus_app_name') || 'Nexus VPN');
      setAppLogo(localStorage.getItem('nexus_app_logo'));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Get stored credentials or use defaults
    const validEmail = localStorage.getItem('nexus_admin_email') || 'admin@gmail.com';
    const validPassword = localStorage.getItem('nexus_admin_password') || 'Admin123';

    // Simulate network delay for better UX
    setTimeout(() => {
      if (email === validEmail && password === validPassword) {
        onLogin(rememberMe);
      } else {
        setError('Invalid email or password');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/20 blur-[120px]"></div>
        <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-purple-600/20 blur-[120px]"></div>
      </div>

      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className={`w-16 h-16 ${appLogo ? 'bg-transparent' : 'bg-gradient-to-br from-blue-600 to-indigo-700'} rounded-xl flex items-center justify-center shadow-lg mb-4 overflow-hidden`}>
              {appLogo ? (
                  <img src={appLogo} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                  <ShieldCheck size={32} className="text-white" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-slate-800">{appName} Admin</h1>
            <p className="text-slate-500 text-sm mt-1">Secure Infrastructure Access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-sm text-red-600 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                  placeholder="admin@gmail.com"
                  required 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                  placeholder="••••••••"
                  required 
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${rememberMe ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white group-hover:border-blue-400'}`}>
                  {rememberMe && <Check size={12} className="text-white" />}
                </div>
                <input 
                  type="checkbox" 
                  className="hidden"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Sign In <ArrowRight size={20} /></>
              )}
            </button>
          </form>
        </div>
        
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
          <p className="text-xs text-slate-400">Restricted Access. Unauthorized use is prohibited.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;