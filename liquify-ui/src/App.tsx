import { createNetworkConfig, SuiClientProvider, WalletProvider, ConnectButton } from '@mysten/dapp-kit';
import { getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@mysten/dapp-kit/dist/index.css';
import { CustomerDashboard } from './components/CustomerDashboard';
import { MerchantDashboard } from './components/MerchantDashboard';
import { LandingPage } from './components/LandingPage';
import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useRole } from './hooks/useRole';

const { networkConfig } = createNetworkConfig({
    testnet: { 
      url: getJsonRpcFullnodeUrl('testnet'),
      network: 'testnet'
    },
    mainnet: { 
      url: getJsonRpcFullnodeUrl('mainnet'),
      network: 'mainnet'
    },
});

const queryClient = new QueryClient();

function Navbar() {
  const location = useLocation();
  const { role, isLoading: roleLoading } = useRole();
  const account = useCurrentAccount();
  const isApp = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/merchant');
  const isMerchant = location.pathname.startsWith('/merchant');

  return (
    <nav className="h-20 px-8 flex items-center justify-between border-b border-black/5 bg-white sticky top-0 z-50">
      <div className="flex items-center gap-12">
        <Link to="/" className="flex items-center gap-3 group">
           <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center text-white group-hover:rotate-6 transition-transform">
              <div className="w-1.5 h-4 bg-white/20 rounded-full -rotate-45" />
           </div>
           <span className="text-2xl font-700 tracking-tightest">Liquify</span>
        </Link>
        {isApp && (
          <div className="hidden lg:flex gap-8">
            <Link to="/dashboard" className={`text-sm font-540 hover:opacity-100 transition-opacity ${!isMerchant ? 'text-black' : 'text-black/40'}`}>Customer Dashboard</Link>
            {role === 'merchant' && (
              <Link to="/merchant" className={`text-sm font-540 hover:opacity-100 transition-opacity ${isMerchant ? 'text-black' : 'text-black/40'}`}>Merchant Hub</Link>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-6">
        {account && !roleLoading && (
          <div className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-700 uppercase tracking-widest border ${
            role === 'merchant' 
              ? 'bg-purple-50 text-purple-600 border-purple-100' 
              : 'bg-blue-50 text-blue-600 border-blue-100'
          }`}>
            {role === 'merchant' ? <ShieldCheck className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
            {role}
          </div>
        )}
        {!isApp ? (
          <Link to="/dashboard" className="btn-pill-black h-10 px-6 !text-sm flex items-center gap-2 group">
            Launch App <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <div className="sui-connect-wrapper scale-90 origin-right">
            <ConnectButton />
          </div>
        )}
      </div>
    </nav>
  );
}

function RoleRedirect() {
  const account = useCurrentAccount();
  const { role, isLoading } = useRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Only redirect if we are on landing or a role-unspecific page AND we haven't redirected this session yet
    if (account && !isLoading && !hasRedirected && location.pathname === '/') {
      if (role === 'merchant') {
        navigate('/merchant');
      } else {
        navigate('/dashboard');
      }
      setHasRedirected(true);
    }
    
    if (!account) {
      setHasRedirected(false);
    }
  }, [account, role, isLoading, navigate, location, hasRedirected]);

  return null;
}

function Footer() {
  return (
    <footer className="py-32 px-8 bg-black text-white mt-auto overflow-hidden relative">
       {/* Background Decoration */}
       <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] -mr-48 -mt-48" />
       
       <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between gap-20">
         <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black">
                  <div className="w-1.5 h-5 bg-black/10 rounded-full -rotate-45" />
               </div>
               <span className="text-2xl font-700">Liquify</span>
            </div>
            <p className="text-white/40 font-320 leading-relaxed tracking-body mb-8">
              The standardized recurring payment protocol for the Sui ecosystem. Built for security, speed, and infinite scale.
            </p>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-3 gap-16 md:gap-24">
            <div>
              <h5 className="font-mono text-[11px] uppercase tracking-mono text-white/30 mb-6">Protocol</h5>
              <div className="flex flex-col gap-4 text-sm font-330 text-white/50">
                <a href="#" className="hover:text-white transition-colors">Documentation</a>
                <a href="#" className="hover:text-white transition-colors">Smart Contracts</a>
                <a href="#" className="hover:text-white transition-colors">Governance</a>
              </div>
            </div>
            <div>
              <h5 className="font-mono text-[11px] uppercase tracking-mono text-white/30 mb-6">Community</h5>
              <div className="flex flex-col gap-4 text-sm font-330 text-white/50">
                <a href="#" className="hover:text-white transition-colors">Discord</a>
                <a href="#" className="hover:text-white transition-colors">Twitter</a>
                <a href="#" className="hover:text-white transition-colors">GitHub</a>
              </div>
            </div>
            <div className="col-span-2 md:col-span-1 border-t border-white/5 pt-8 md:border-none md:pt-0">
               <h5 className="font-mono text-[11px] uppercase tracking-mono text-white/30 mb-6">Powered by</h5>
               <div className="font-700 text-2xl tracking-tightest opacity-30 italic">SUI NETWORK</div>
            </div>
         </div>
       </div>
       <div className="max-w-7xl mx-auto border-t border-white/5 mt-24 pt-8 flex justify-between items-center text-[10px] font-mono text-white/20 uppercase tracking-mono">
          <span>© 2026 LIQUIFY PROTOCOL. ALL RIGHTS RESERVED.</span>
          <span>BUILT WITH PRECISION FOR COMMANDOSS</span>
       </div>
    </footer>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col font-330 selection:bg-black selection:text-white bg-white">
              <Toaster position="top-right" richColors expand={true} />
              <RoleRedirect />
              <Navbar />
              
              <main className="flex-1 w-full">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={
                    <div className="max-w-7xl mx-auto px-8 py-12">
                      <CustomerDashboard />
                    </div>
                  } />
                  <Route path="/merchant" element={
                    <div className="max-w-7xl mx-auto px-8 py-12">
                      <MerchantDashboard />
                    </div>
                  } />
                </Routes>
              </main>

              <Footer />
            </div>
          </BrowserRouter>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default App;

