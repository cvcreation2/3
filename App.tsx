import React, { useState, useEffect, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import { Page } from './types';
import { Bell, Search, User as UserIcon, AlertTriangle } from 'lucide-react';

// Lazy Load Pages to prevent single-page crash from breaking entire app
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Servers = React.lazy(() => import('./pages/Servers'));
const UsersPage = React.lazy(() => import('./pages/Users'));
const Monetization = React.lazy(() => import('./pages/Monetization'));
const AIInsights = React.lazy(() => import('./pages/AIInsights'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Login = React.lazy(() => import('./pages/Login'));

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

// Error Boundary Component
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-50 text-slate-800">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center border border-red-100">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
               <AlertTriangle className="text-red-600" size={24} />
            </div>
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-sm text-slate-500 mb-4">The application encountered a critical error in this section.</p>
            <div className="bg-slate-900 rounded-lg p-3 mb-6 text-left overflow-auto max-h-32">
                <code className="text-xs text-red-400 font-mono">{this.state.error?.toString()}</code>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Spinner
const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[400px]">
    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // Profile State
  const [adminName, setAdminName] = useState('Admin User');
  const [adminAvatar, setAdminAvatar] = useState<string | null>(null);

  // App Branding State
  const [appName, setAppName] = useState('Nexus VPN');
  const [appLogo, setAppLogo] = useState<string | null>(null);

  const loadData = () => {
      try {
        // Load Profile
        setAdminName(localStorage.getItem('nexus_admin_name') || 'Admin User');
        setAdminAvatar(localStorage.getItem('nexus_admin_avatar'));
        
        // Load Branding
        setAppName(localStorage.getItem('nexus_app_name') || 'Nexus VPN');
        setAppLogo(localStorage.getItem('nexus_app_logo'));
      } catch (e) {
        console.warn("Failed to load local storage data", e);
      }
  };

  // Check for existing session on mount
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem('nexus_admin_auth') || sessionStorage.getItem('nexus_admin_auth');
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
      }
      loadData();
    } catch (e) {
      console.error("Auth check failed", e);
    } finally {
      setIsLoading(false);
    }

    // Listen for profile/branding updates
    const handleUpdate = () => loadData();
    window.addEventListener('admin_profile_updated', handleUpdate);
    window.addEventListener('app_branding_updated', handleUpdate);
    
    return () => {
        window.removeEventListener('admin_profile_updated', handleUpdate);
        window.removeEventListener('app_branding_updated', handleUpdate);
    }
  }, []);

  const handleLogin = (remember: boolean) => {
    setIsAuthenticated(true);
    if (remember) {
        localStorage.setItem('nexus_admin_auth', 'true');
    } else {
        sessionStorage.setItem('nexus_admin_auth', 'true');
    }
    loadData();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('nexus_admin_auth');
    sessionStorage.removeItem('nexus_admin_auth');
    setCurrentPage(Page.DASHBOARD);
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.DASHBOARD:
        return <Dashboard />;
      case Page.SERVERS:
        return <Servers />;
      case Page.USERS:
        return <UsersPage />;
      case Page.MONETIZATION:
        return <Monetization />;
      case Page.AI_INSIGHTS:
        return <AIInsights />;
      case Page.SETTINGS:
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>}>
            <ErrorBoundary>
                <Login onLogin={handleLogin} />
            </ErrorBoundary>
        </Suspense>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        onLogout={handleLogout} 
        appLogo={appLogo}
        appName={appName}
      />
      
      <main className="flex-1 ml-64 flex flex-col h-screen">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-4 text-slate-400">
                <Search size={20} />
                <input type="text" placeholder="Quick search..." className="bg-transparent outline-none text-slate-600 placeholder:text-slate-400 text-sm w-64" />
            </div>

            <div className="flex items-center gap-6">
                <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-bold text-slate-800">{adminName}</div>
                        <div className="text-xs text-slate-500">Super Administrator</div>
                    </div>
                    <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border border-slate-200 overflow-hidden">
                        {adminAvatar ? (
                             <img src={adminAvatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <UserIcon size={20} />
                        )}
                    </div>
                </div>
            </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 relative">
            <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                    {renderPage()}
                </Suspense>
            </ErrorBoundary>
        </div>
      </main>
    </div>
  );
};

export default App;