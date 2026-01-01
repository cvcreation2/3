import React, { useState } from 'react';
import { Save, DollarSign, Smartphone, CreditCard, Check } from 'lucide-react';
import { AdConfig } from '../types';

const Monetization: React.FC = () => {
  const [adConfig, setAdConfig] = useState<AdConfig>({
    enabled: true,
    adMobAppId: 'ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy',
    bannerUnitId: 'ca-app-pub-xxxxxxxxxxxxxxxx/zzzzzzzzzz',
    interstitialUnitId: 'ca-app-pub-xxxxxxxxxxxxxxxx/wwwwwwwwww',
    rewardedUnitId: 'ca-app-pub-xxxxxxxxxxxxxxxx/vvvvvvvvvv',
    interstitialInterval: 300
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChange = (key: keyof AdConfig, value: any) => {
    setAdConfig({ ...adConfig, [key]: value });
  };

  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-2xl font-bold text-slate-800">Monetization</h2>
          <p className="text-slate-500">Configure AdMob integration and Subscription plans.</p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AdMob Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                    <Smartphone size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Google AdMob Config</h3>
            </div>
            
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                        <h4 className="font-medium text-slate-900">Enable Ads</h4>
                        <p className="text-xs text-slate-500">Toggle all ads in the application</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={adConfig.enabled} onChange={(e) => handleChange('enabled', e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">App ID</label>
                    <input 
                        type="text" 
                        value={adConfig.adMobAppId} 
                        onChange={(e) => handleChange('adMobAppId', e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" 
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Banner Unit ID</label>
                    <input 
                        type="text" 
                        value={adConfig.bannerUnitId} 
                        onChange={(e) => handleChange('bannerUnitId', e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" 
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Interstitial Unit ID</label>
                    <input 
                        type="text" 
                        value={adConfig.interstitialUnitId} 
                        onChange={(e) => handleChange('interstitialUnitId', e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Interstitial Interval (seconds)</label>
                    <input 
                        type="number" 
                        value={adConfig.interstitialInterval} 
                        onChange={(e) => handleChange('interstitialInterval', parseInt(e.target.value))}
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                </div>

                <button 
                    onClick={handleSave} 
                    className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                        saved ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                >
                    {saved ? <><Check size={18} /> Saved!</> : <><Save size={18} /> Save Ad Config</>}
                </button>
            </div>
        </div>

        {/* Subscription Plans */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                    <CreditCard size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Subscription Plans</h3>
            </div>

            <div className="space-y-4">
                {['Premium Monthly', 'Premium Yearly', 'VIP Access'].map((plan, idx) => (
                    <div key={idx} className="p-4 border border-slate-200 rounded-xl hover:border-purple-300 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-slate-800">{plan}</h4>
                            <span className="text-purple-600 font-bold">${idx === 0 ? '9.99' : idx === 1 ? '89.99' : '19.99'}/mo</span>
                        </div>
                        <p className="text-sm text-slate-500 mb-3">Unlimited bandwidth, {idx === 2 ? 'All locations + Dedicated IP' : 'All locations'}.</p>
                        <div className="flex gap-2">
                             <button className="text-xs px-3 py-1.5 bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 font-medium">Edit Price</button>
                             <button className="text-xs px-3 py-1.5 bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 font-medium">Features</button>
                        </div>
                    </div>
                ))}
                
                <button className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-medium hover:border-purple-400 hover:text-purple-600 transition-colors">
                    + Create New Plan
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Monetization;