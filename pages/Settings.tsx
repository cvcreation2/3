import React, { useState, useEffect } from 'react';
import { Save, Key, Globe, Shield, RefreshCw, Zap, Upload, Download, Check, Lock, User, Camera, Image as ImageIcon } from 'lucide-react';

const Settings: React.FC = () => {
  const [bypassEnabled, setBypassEnabled] = useState(false);
  
  // Admin Credentials State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminAvatar, setAdminAvatar] = useState<string | null>(null);
  
  // App Branding State
  const [appName, setAppName] = useState('');
  const [appLogo, setAppLogo] = useState<string | null>(null);

  const [profileSaved, setProfileSaved] = useState(false);
  const [generalSaved, setGeneralSaved] = useState(false);

  useEffect(() => {
    // Load existing credentials on mount
    setAdminEmail(localStorage.getItem('nexus_admin_email') || 'admin@gmail.com');
    setAdminPassword(localStorage.getItem('nexus_admin_password') || 'Admin123');
    setAdminName(localStorage.getItem('nexus_admin_name') || 'Admin User');
    setAdminAvatar(localStorage.getItem('nexus_admin_avatar'));
    
    // Load Branding
    setAppName(localStorage.getItem('nexus_app_name') || 'Nexus VPN');
    setAppLogo(localStorage.getItem('nexus_app_logo'));
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'admin' | 'app') => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const base64String = reader.result as string;
              if (type === 'admin') {
                  setAdminAvatar(base64String);
              } else {
                  setAppLogo(base64String);
              }
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSaveProfile = () => {
    localStorage.setItem('nexus_admin_email', adminEmail);
    localStorage.setItem('nexus_admin_password', adminPassword);
    localStorage.setItem('nexus_admin_name', adminName);
    if (adminAvatar) {
        localStorage.setItem('nexus_admin_avatar', adminAvatar);
    }
    
    // Dispatch event to update Header immediately
    window.dispatchEvent(new Event('admin_profile_updated'));

    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleSaveGeneral = () => {
    localStorage.setItem('nexus_app_name', appName);
    if (appLogo) {
        localStorage.setItem('nexus_app_logo', appLogo);
    }
    window.dispatchEvent(new Event('app_branding_updated'));
    
    setGeneralSaved(true);
    setTimeout(() => setGeneralSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-6">
       <div>
          <h2 className="text-2xl font-bold text-slate-800">System Settings</h2>
          <p className="text-slate-500">Configure global application parameters and API keys.</p>
        </div>

      {/* Admin Account Security */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
             <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <Shield size={20} />
             </div>
             <h3 className="font-bold text-slate-800">Admin Profile & Security</h3>
        </div>
        <div className="p-6 space-y-8">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full border-4 border-slate-100 shadow-inner overflow-hidden flex items-center justify-center bg-slate-100">
                        {adminAvatar ? (
                            <img src={adminAvatar} alt="Admin" className="w-full h-full object-cover" />
                        ) : (
                            <User size={40} className="text-slate-400" />
                        )}
                    </div>
                    <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full cursor-pointer hover:bg-indigo-700 shadow-lg border-2 border-white transition-all">
                        <Camera size={16} />
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'admin')} />
                    </label>
                </div>
                <div>
                    <h4 className="font-bold text-slate-800">Profile Photo</h4>
                    <p className="text-sm text-slate-500">Upload a professional photo or company logo.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
                    <input 
                        type="text" 
                        value={adminName} 
                        onChange={(e) => setAdminName(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                        placeholder="e.g. System Administrator" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Admin Email Address</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="email" 
                            value={adminEmail} 
                            onChange={(e) => setAdminEmail(e.target.value)}
                            className="w-full pl-10 p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" 
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            value={adminPassword} 
                            onChange={(e) => setAdminPassword(e.target.value)}
                            className="w-full pl-10 p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" 
                        />
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-4">
                <button 
                    onClick={handleSaveProfile}
                    className={`px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all shadow-md ${
                        profileSaved ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                >
                    {profileSaved ? <><Check size={18} /> Profile Updated!</> : <><Save size={18} /> Save Changes</>}
                </button>
            </div>
        </div>
      </div>

       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
             <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Globe size={20} />
             </div>
             <h3 className="font-bold text-slate-800">General Configuration</h3>
        </div>
        <div className="p-6 space-y-8">
             {/* App Logo Section */}
             <div className="flex items-center gap-6">
                <div className="relative group">
                    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 overflow-hidden">
                        {appLogo ? (
                            <img src={appLogo} alt="App Logo" className="w-full h-full object-contain p-2" />
                        ) : (
                            <ImageIcon size={30} className="text-slate-400" />
                        )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 p-1.5 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 shadow-lg border-2 border-white transition-all">
                        <Upload size={14} />
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'app')} />
                    </label>
                </div>
                <div>
                    <h4 className="font-bold text-slate-800">Application Branding</h4>
                    <p className="text-sm text-slate-500">Logo and application name visible in sidebar and login.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Application Name</label>
                    <input 
                        type="text" 
                        value={appName} 
                        onChange={(e) => setAppName(e.target.value)} 
                        className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
                    <input type="email" defaultValue="support@nexusvpn.com" className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Privacy Policy URL</label>
                    <input type="url" defaultValue="https://nexusvpn.com/privacy" className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Terms of Service URL</label>
                    <input type="url" defaultValue="https://nexusvpn.com/terms" className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>
            
            <div className="flex items-center gap-2 pt-4">
                <button 
                    onClick={handleSaveGeneral}
                    className={`px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all shadow-md ${
                        generalSaved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                     {generalSaved ? <><Check size={18} /> Settings Saved!</> : <><Save size={18} /> Save Configuration</>}
                </button>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <Zap size={20} />
                </div>
                <h3 className="font-bold text-slate-800">ISP Bypass & Network</h3>
             </div>
             <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={bypassEnabled} onChange={(e) => setBypassEnabled(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
        </div>
        <div className={`p-6 space-y-6 ${!bypassEnabled ? 'opacity-50 pointer-events-none grayscale-[0.5]' : ''}`}>
             <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg text-sm text-orange-800 mb-4">
                <strong>Warning:</strong> Advanced network settings. Incorrect configuration may result in connection failures.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Custom DNS Servers</label>
                    <input type="text" defaultValue="8.8.8.8, 1.1.1.1" placeholder="Primary DNS, Secondary DNS" className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" />
                    <p className="text-xs text-slate-500 mt-1">Comma-separated list of DNS servers to override default ISP DNS.</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Proxy Host (IP/Domain)</label>
                    <input type="text" placeholder="10.10.10.1" className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Proxy Port</label>
                    <input type="number" placeholder="8080" className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" />
                </div>
            </div>
            
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 text-sm font-medium">
                    <Upload size={16} /> Import Config
                </button>
                <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 text-sm font-medium">
                    <Download size={16} /> Export Config
                </button>
                <div className="flex-1"></div>
                <button className="px-6 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 flex items-center gap-2">
                    <Save size={18} /> Update Network
                </button>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
             <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Key size={20} />
             </div>
             <h3 className="font-bold text-slate-800">API Access (For Mobile App)</h3>
        </div>
        <div className="p-6 space-y-6">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                <strong>Important:</strong> Use these credentials in your mobile application to connect to this admin panel securely.
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Admin API Endpoint</label>
                    <div className="flex gap-2">
                        <input type="text" readOnly value="https://api.nexusvpn.com/v1/admin" className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-600 font-mono text-sm" />
                        <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><RefreshCw size={18}/></button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Secret Key</label>
                    <div className="flex gap-2">
                        <input type="password" value="sk_live_51M3Txxxxxxxxxxxxxxxxxxxx" readOnly className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-600 font-mono text-sm" />
                         <button className="px-3 py-1 bg-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-300">Reveal</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;