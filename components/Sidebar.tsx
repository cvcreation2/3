import React from 'react';
import { LayoutDashboard, Server, Users, DollarSign, Cpu, Settings, ShieldCheck, LogOut } from 'lucide-react';
import { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  appLogo?: string | null;
  appName?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, onLogout, appLogo, appName = 'Nexus VPN' }) => {
  const navItems = [
    { id: Page.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: Page.SERVERS, label: 'Servers', icon: Server },
    { id: Page.USERS, label: 'Users', icon: Users },
    { id: Page.MONETIZATION, label: 'Monetization', icon: DollarSign },
    { id: Page.AI_INSIGHTS, label: 'AI Insights', icon: Cpu },
    { id: Page.SETTINGS, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 shadow-xl z-50">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className={`${appLogo ? '' : 'bg-blue-600 p-2 rounded-lg'}`}>
          {appLogo ? (
              <img src={appLogo} alt="Logo" className="w-10 h-10 object-contain rounded-md" />
          ) : (
              <ShieldCheck size={24} className="text-white" />
          )}
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">{appName}</h1>
          <p className="text-xs text-slate-400">Admin Panel v2.0</p>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-4">
        <div className="bg-slate-800 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-green-400">Operational</span>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;