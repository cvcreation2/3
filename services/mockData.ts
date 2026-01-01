import { ServerNode, ServerProtocol, User, SystemMetric } from '../types';

export const MOCK_SERVERS: ServerNode[] = [
  { 
    id: '1', name: 'US-East-1', ip: '192.168.1.101', port: 443, protocol: ServerProtocol.VLESS, 
    country: 'United States', status: 'online', load: 45, bandwidthUsed: '4.5 TB',
    transport: 'ws', tls: true, sni: 'us-east.nexusvpn.com', path: '/vless-ws'
  },
  { 
    id: '2', name: 'SG-Asia-1', ip: '203.0.113.5', port: 443, protocol: ServerProtocol.VMESS, 
    country: 'Singapore', status: 'online', load: 78, bandwidthUsed: '12.1 TB',
    transport: 'ws', tls: true, sni: 'sg.nexusvpn.com', path: '/api/vmess'
  },
  { 
    id: '3', name: 'DE-Frankfurt', ip: '198.51.100.23', port: 1194, protocol: ServerProtocol.OPENVPN, 
    country: 'Germany', status: 'maintenance', load: 0, bandwidthUsed: '2.3 TB',
    transport: 'tcp', tls: false
  },
  { 
    id: '4', name: 'UK-London', ip: '51.15.12.11', port: 51820, protocol: ServerProtocol.WIREGUARD, 
    country: 'United Kingdom', status: 'online', load: 22, bandwidthUsed: '1.8 TB',
    transport: 'udp' as any, tls: false
  },
  { 
    id: '5', name: 'JP-Tokyo', ip: '13.114.22.55', port: 443, protocol: ServerProtocol.HYSTERIA2, 
    country: 'Japan', status: 'offline', load: 0, bandwidthUsed: '5.6 TB',
    transport: 'udp' as any, tls: true, sni: 'jp.nexusvpn.com'
  },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice Smith', email: 'alice@example.com', status: 'active', subscription: 'vip', lastLogin: '2023-10-27 10:30', deviceCount: 3 },
  { id: 'u2', name: 'Bob Jones', email: 'bob@test.com', status: 'expired', subscription: 'premium', lastLogin: '2023-10-25 14:20', deviceCount: 1 },
  { id: 'u3', name: 'Charlie Day', email: 'charlie@vpn.net', status: 'banned', subscription: 'free', lastLogin: '2023-10-20 09:15', deviceCount: 0 },
  { id: 'u4', name: 'Dave Wilson', email: 'dave@user.com', status: 'active', subscription: 'free', lastLogin: '2023-10-27 11:45', deviceCount: 1 },
  { id: 'u5', name: 'Eve Hacker', email: 'eve@hacker.com', status: 'active', subscription: 'premium', lastLogin: '2023-10-27 12:00', deviceCount: 2 },
];

export const MOCK_METRICS: SystemMetric[] = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  cpu: Math.floor(Math.random() * 60) + 20,
  memory: Math.floor(Math.random() * 50) + 30,
  activeConnections: Math.floor(Math.random() * 5000) + 1000,
}));

export const getSystemHealthReport = (): string => {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    global_status: "Healthy",
    active_nodes: 4,
    total_bandwidth_24h: "450TB",
    alerts: [
      { level: "warning", message: "High latency detected on SG-Asia-1" },
      { level: "info", message: "User registration spike in region: BR" }
    ],
    infrastructure: {
      cpu_avg: "45%",
      ram_avg: "62%"
    }
  }, null, 2);
}