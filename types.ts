export enum ServerProtocol {
  VMESS = 'VMess',
  VLESS = 'VLESS',
  TROJAN = 'Trojan',
  SHADOWSOCKS = 'Shadowsocks',
  OPENVPN = 'OpenVPN',
  WIREGUARD = 'WireGuard',
  HYSTERIA2 = 'Hysteria2',
  TUIC = 'Tuic',
  SOCKS5 = 'Socks5',
  SSH = 'SSH',
  HTTP = 'HTTP'
}

export interface ServerNode {
  id: string;
  name: string;
  ip: string;
  port: number;
  protocol: ServerProtocol;
  country: string;
  status: 'online' | 'offline' | 'maintenance';
  load: number; // 0-100
  bandwidthUsed: string; // e.g., "1.2 TB"
  // Advanced Configuration
  transport: 'tcp' | 'kcp' | 'ws' | 'http' | 'quic' | 'grpc';
  tls: boolean;
  sni?: string; // Server Name Indication
  path?: string; // WebSocket/gRPC path
  udpPort?: number; // Specific for QUIC/UDP based protocols
  
  // Advanced Payload
  customPayload?: string;
  enablePayload?: boolean;
  payloadInterval?: number; // seconds
}

export interface User {
  id: string;
  name: string; // Added name
  avatar?: string; // Added avatar URL/Base64
  email: string;
  status: 'active' | 'banned' | 'expired';
  subscription: 'free' | 'premium' | 'vip';
  lastLogin: string;
  deviceCount: number;
}

export interface AdConfig {
  enabled: boolean;
  adMobAppId: string;
  bannerUnitId: string;
  interstitialUnitId: string;
  rewardedUnitId: string;
  interstitialInterval: number; // seconds
}

export interface SystemMetric {
  time: string;
  cpu: number;
  memory: number;
  activeConnections: number;
}

export enum Page {
  DASHBOARD = 'dashboard',
  SERVERS = 'servers',
  USERS = 'users',
  MONETIZATION = 'monetization',
  AI_INSIGHTS = 'ai_insights',
  SETTINGS = 'settings'
}