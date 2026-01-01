import React, { useState, useEffect } from 'react';
import { Server, MoreVertical, Plus, Power, Trash2, Edit, Settings, Code, Clock, AlertCircle, Globe } from 'lucide-react';
import { MOCK_SERVERS } from '../services/mockData';
import { ServerNode, ServerProtocol } from '../types';

const COUNTRIES = [
  'United States', 'United Kingdom', 'Germany', 'Singapore', 'Japan', 
  'Canada', 'Netherlands', 'France', 'Australia', 'Brazil', 'India'
];

const Servers: React.FC = () => {
  const [servers, setServers] = useState<ServerNode[]>(MOCK_SERVERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Simulate Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setServers(currentServers => 
        currentServers.map(s => {
          // Randomly fluctuate load
          const newLoad = Math.max(0, Math.min(100, s.load + (Math.random() > 0.5 ? 2 : -2)));
          return { ...s, load: newLoad };
        })
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Form State
  const [formData, setFormData] = useState<Partial<ServerNode>>({
    name: '', ip: '', port: 443, protocol: ServerProtocol.VMESS, country: 'United States',
    transport: 'ws', tls: false, sni: '', path: '/',
    customPayload: '', enablePayload: false, payloadInterval: 60,
    udpPort: 443
  });

  const handleDelete = (id: string) => {
    if(window.confirm('Are you sure you want to delete this server? This action cannot be undone.')) {
        setServers(servers.filter(s => s.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setServers(servers.map(s => {
        if(s.id === id) {
            return { ...s, status: s.status === 'online' ? 'offline' : 'online' };
        }
        return s;
    }));
  };

  const handleAddServer = () => {
    const newServer: ServerNode = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name || 'New Server',
        ip: formData.ip || '0.0.0.0',
        port: formData.port || 443,
        protocol: formData.protocol || ServerProtocol.VMESS,
        country: formData.country || 'Unknown',
        status: 'offline',
        load: 0,
        bandwidthUsed: '0 GB',
        transport: formData.transport || 'ws',
        tls: formData.tls || false,
        sni: formData.sni,
        path: formData.path,
        udpPort: formData.udpPort,
        customPayload: formData.customPayload,
        enablePayload: formData.enablePayload,
        payloadInterval: formData.payloadInterval
    };
    setServers([...servers, newServer]);
    setIsModalOpen(false);
    setFormData({ 
        name: '', ip: '', port: 443, protocol: ServerProtocol.VMESS, country: 'United States',
        transport: 'ws', tls: false, sni: '', path: '/',
        customPayload: '', enablePayload: false, payloadInterval: 60,
        udpPort: 443
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Server Nodes</h2>
          <p className="text-slate-500">Manage your VPN infrastructure endpoints.</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus size={20} />
          Add Node
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-800 font-semibold uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Name / ID</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Protocol</th>
                <th className="px-6 py-4">Config</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Load</th>
                <th className="px-6 py-4">Bandwidth</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {servers.map((server) => (
                <tr key={server.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                        <Server size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{server.name}</div>
                        <div className="text-xs text-slate-500">{server.ip}:{server.port}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <Globe size={14} className="text-slate-400" />
                        <span>{server.country}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-semibold">
                      {server.protocol}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">
                    {server.transport.toUpperCase()} {server.tls ? '+TLS' : ''}
                    {server.transport === 'quic' && server.udpPort ? ` (UDP:${server.udpPort})` : ''}
                    {server.path ? <div className="text-[10px] truncate max-w-[100px]">{server.path}</div> : null}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                          {server.status === 'online' && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          )}
                          <span className={`relative inline-flex rounded-full h-3 w-3 ${
                              server.status === 'online' ? 'bg-green-500' :
                              server.status === 'maintenance' ? 'bg-orange-500' : 'bg-red-500'
                          }`}></span>
                        </span>
                        <span className="capitalize font-medium">{server.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-slate-200 rounded-full h-2 w-24">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                            server.load > 80 ? 'bg-red-500' : server.load > 50 ? 'bg-yellow-500' : 'bg-green-500'
                        }`} 
                        style={{ width: `${server.load}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-500 mt-1 block">{server.load}%</span>
                  </td>
                  <td className="px-6 py-4">{server.bandwidthUsed}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button onClick={() => toggleStatus(server.id)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Power size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(server.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={18} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Advanced Server Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Configure Server Node</h3>
                        <p className="text-sm text-slate-500">Setup connection details and advanced transport settings.</p>
                    </div>
                    <div className="p-2 bg-slate-100 rounded-full">
                        <Settings size={20} className="text-slate-500" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Basic Info */}
                    <div className="col-span-2 space-y-4">
                        <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider border-b pb-2">Basic Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Server Name</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                    placeholder="e.g., US-Optimized-1" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                <select 
                                    value={formData.country}
                                    onChange={e => setFormData({...formData, country: e.target.value})}
                                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none bg-white"
                                >
                                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Protocol</label>
                                <select 
                                    value={formData.protocol}
                                    onChange={e => setFormData({...formData, protocol: e.target.value as ServerProtocol})}
                                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none bg-white"
                                >
                                    {Object.values(ServerProtocol).map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">IP / Hostname</label>
                                <input 
                                    type="text" 
                                    value={formData.ip}
                                    onChange={e => setFormData({...formData, ip: e.target.value})}
                                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none font-mono text-sm" 
                                    placeholder="192.168.x.x" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Port</label>
                                <input 
                                    type="number" 
                                    value={formData.port}
                                    onChange={e => setFormData({...formData, port: parseInt(e.target.value)})}
                                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none font-mono text-sm" 
                                    placeholder="443" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Advanced Transport */}
                    <div className="col-span-2 space-y-4">
                        <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider border-b pb-2">Transport & Security</h4>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Transport</label>
                                <select 
                                    value={formData.transport}
                                    onChange={e => setFormData({...formData, transport: e.target.value as any})}
                                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none bg-white"
                                >
                                    <option value="tcp">TCP</option>
                                    <option value="ws">WebSocket (WS)</option>
                                    <option value="grpc">gRPC</option>
                                    <option value="http">HTTP/2</option>
                                    <option value="kcp">mKCP</option>
                                    <option value="quic">QUIC</option>
                                </select>
                            </div>
                             <div className="flex items-end pb-3">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.tls}
                                        onChange={e => setFormData({...formData, tls: e.target.checked})}
                                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                                    />
                                    <span className="text-sm font-medium text-slate-700">Enable TLS / SSL</span>
                                </label>
                            </div>
                        </div>

                        {formData.transport === 'quic' && (
                             <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">QUIC UDP Port</label>
                                <input 
                                    type="number" 
                                    value={formData.udpPort}
                                    onChange={e => setFormData({...formData, udpPort: parseInt(e.target.value)})}
                                    className="w-full p-2 border border-slate-300 rounded-lg outline-none font-mono text-sm" 
                                    placeholder="443" 
                                />
                                <p className="text-xs text-slate-500 mt-1">QUIC requires a UDP port. Often the same as the TCP port.</p>
                            </div>
                        )}

                        {(formData.transport === 'ws' || formData.transport === 'grpc' || formData.transport === 'http') && (
                            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Stream Settings</label>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Path / Service Name</label>
                                    <input 
                                        type="text" 
                                        value={formData.path}
                                        onChange={e => setFormData({...formData, path: e.target.value})}
                                        className="w-full p-2 border border-slate-300 rounded-lg outline-none font-mono text-sm" 
                                        placeholder={formData.transport === 'ws' ? '/ws-path' : 'grpcServiceName'} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">SNI (Server Name)</label>
                                    <input 
                                        type="text" 
                                        value={formData.sni}
                                        onChange={e => setFormData({...formData, sni: e.target.value})}
                                        className="w-full p-2 border border-slate-300 rounded-lg outline-none font-mono text-sm" 
                                        placeholder="vpn.example.com" 
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Advanced Settings (Payload) */}
                    <div className="col-span-2 space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Advanced Settings</h4>
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">Power Users</span>
                        </div>
                        
                        <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-4">
                             <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <div className="relative">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.enablePayload}
                                            onChange={e => setFormData({...formData, enablePayload: e.target.checked})}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">Enable Custom Payload</span>
                                </label>

                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-slate-400" />
                                    <span className="text-sm text-slate-600">Interval (s):</span>
                                    <input 
                                        type="number" 
                                        value={formData.payloadInterval}
                                        onChange={e => setFormData({...formData, payloadInterval: parseInt(e.target.value)})}
                                        className="w-20 p-1 border border-slate-300 rounded text-center text-sm"
                                        min="10"
                                    />
                                </div>
                             </div>

                             {formData.enablePayload && (
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <Code size={16} /> Payload Configuration
                                    </label>
                                    <textarea 
                                        value={formData.customPayload}
                                        onChange={e => setFormData({...formData, customPayload: e.target.value})}
                                        rows={4}
                                        className="w-full p-3 border border-slate-300 rounded-lg font-mono text-xs bg-slate-900 text-green-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder={`{"header": {"type": "http"}, "request": {"path": ["/"]}}`}
                                    />
                                    <p className="text-xs text-slate-500">
                                        Inject custom payload headers for specific ISP bypass requirements. Supports JSON or raw string format.
                                    </p>
                                </div>
                             )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancel</button>
                    <button onClick={handleAddServer} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-colors">Save Configuration</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Servers;