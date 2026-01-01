import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { MOCK_METRICS } from '../services/mockData';
import { Users, Server, Activity, ArrowUp, ArrowDown } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      {change >= 0 ? (
        <span className="text-green-500 flex items-center font-medium">
          <ArrowUp size={16} className="mr-1" /> {change}%
        </span>
      ) : (
        <span className="text-red-500 flex items-center font-medium">
          <ArrowDown size={16} className="mr-1" /> {Math.abs(change)}%
        </span>
      )}
      <span className="text-slate-400 ml-2">vs last month</span>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
        <div className="flex gap-2">
           <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Live Updates On</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value="12,345" change={12.5} icon={Users} color="bg-blue-600" />
        <StatCard title="Active Connections" value="4,291" change={-2.4} icon={Activity} color="bg-green-600" />
        <StatCard title="Servers Online" value="48/50" change={0} icon={Server} color="bg-purple-600" />
        <StatCard title="Total Revenue" value="$45,290" change={8.1} icon={Activity} color="bg-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Traffic Overview (24h)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_METRICS}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="activeConnections" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Resource Usage</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_METRICS.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="cpu" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="CPU %" />
                <Bar dataKey="memory" fill="#f43f5e" radius={[4, 4, 0, 0]} name="RAM %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;