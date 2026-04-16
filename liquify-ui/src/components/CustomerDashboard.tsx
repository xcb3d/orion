import { motion } from 'framer-motion';
import { Plus, ArrowUpRight, Signal, Zap, ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { sdk } from '../services/sui';
import { ActionModal } from './ActionModal';
import { useRole } from '../hooks/useRole';

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] }
};

export function CustomerDashboard() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const [vaultBalance, setVaultBalance] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userSubscriptions, setUserSubscriptions] = useState<any[]>([]);
   const [isLoadingSubs, setIsLoadingSubs] = useState(false);
  const { role, refetch: refetchRole } = useRole();
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Modal state
  const [activeModal, setActiveModal] = useState<{ type: 'deposit' | 'withdraw'; isOpen: boolean }>({
    type: 'deposit',
    isOpen: false
  });

  const fetchVaultData = async () => {
    if (!account) return;
    setIsRefreshing(true);
    try {
      const balance = await sdk.fetchVaultBalance(account.address);
      setVaultBalance(balance);
    } catch (e) {
      toast.error("Failed to fetch balance");
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchWalletBalance = async () => {
    if (!account) return;
    try {
      const balanceObj = await client.getBalance({ owner: account.address, coinType: '0x2::sui::SUI' });
      setWalletBalance(Number(balanceObj.totalBalance) / 1000000000);
    } catch (e) {
      console.error("Wallet balance fetch error:", e);
    }
  };

  const fetchSubscriptions = async () => {
    if (!account) return;
    setIsLoadingSubs(true);
    try {
      const response = await client.getOwnedObjects({
        owner: account.address,
        filter: {
          StructType: `${sdk.config.packageId}::suipay::SubscriptionPermission`
        },
        options: {
          showContent: true
        }
      });
      setUserSubscriptions(response.data || []);
    } catch (e) {
      console.error("Subs fetch error:", e);
    } finally {
      setIsLoadingSubs(false);
    }
  };

  useEffect(() => {
    fetchVaultData();
    fetchWalletBalance();
    fetchSubscriptions();
  }, [account]);

  const handleActionClick = (type: 'deposit' | 'withdraw') => {
    if (!account) return toast.error("Please connect wallet");
    setActiveModal({ type, isOpen: true });
  };

  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const executeAction = async (amount: number) => {
    const type = activeModal.type;
    try {
      const tx = type === 'deposit' ? sdk.buildDepositTx(amount) : sdk.buildWithdrawTx(amount);
      
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log("Tx Success:", result);
            toast.success(type === 'deposit' 
              ? "Vault secured. Syncing balance..." 
              : "Assets released. Wallet updating..."
            );
            
            // Immediate refetch
            fetchVaultData();
            
            // Delayed refetch for indexing latency
            setTimeout(() => {
                fetchVaultData();
                fetchWalletBalance();
            }, 2000);
            setTimeout(() => {
                fetchVaultData();
                fetchWalletBalance();
                fetchSubscriptions(); // Also refetch subs just in case
            }, 5000);
          },
          onError: (err) => {
            console.error("Tx Error:", err);
            const isRejected = err.message.toLowerCase().includes('user rejected');
            toast.error(isRejected 
              ? "Operation discarded by user." 
              : `Protocol error: ${err.message}`
            );
          }
        }
      );
    } catch (e) {
      toast.error(`${type} failed`);
    }
  };

  const registerAsMerchant = async () => {
    if (!account) return;
    setIsRegistering(true);
    try {
      const tx = sdk.buildRegisterMerchantTx();
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log("Merchant Registration Success:", result);
            toast.success("Merchant Identity Registered!");
            refetchRole();
            // App.tsx handles the actual redirect via RoleRedirect component
          },
          onError: (err) => {
            console.error("Registration Error:", err);
            toast.error(`Registration failed: ${err.message}`);
          }
        }
      );
    } catch (e) {
      toast.error("Registration failed");
    } finally {
      setIsRegistering(false);
    }
  };

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center py-40 border border-black/5 rounded-container">
        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-10">
           <Lock className="w-10 h-10 text-black/10" />
        </div>
        <h2 className="text-4xl font-400 italic mb-4 tracking-heading text-black">Access Blocked.</h2>
        <p className="text-black/30 text-center max-w-sm font-320 leading-relaxed tracking-body">
          Your smart vault is isolated on-chain. Connect your Sui wallet to authorize access.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-24 pb-40">
      <ActionModal 
        isOpen={activeModal.isOpen}
        type={activeModal.type}
        maxAmount={activeModal.type === 'deposit' ? walletBalance : vaultBalance}
        onClose={() => setActiveModal({ ...activeModal, isOpen: false })}
        onConfirm={executeAction}
      />

      {/* 🛠️ EDITORIAL VAULT STATEMENT */}
      <section className="relative">
        <motion.div {...reveal} className="max-w-4xl">
           <div className="flex items-center gap-3 mb-8">
              <span className="mono-label text-black/60 tracking-mono-small uppercase">Vault Status</span>
              {isRefreshing && <Signal className="w-3 h-3 animate-pulse text-black/40" />}
           </div>
           <h2 className="text-[64px] font-340 leading-[1.1] tracking-heading text-black/80 mb-12">
             You are currently securing <br />
             <span className="text-black font-540 not-italic">
               {vaultBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} SUI
             </span> in your smart vault.
           </h2>
           
           <div className="flex gap-4">
              <button 
                onClick={() => handleActionClick('deposit')}
                className="btn-pill bg-black text-white px-8 h-12 text-sm font-540 flex items-center gap-2 group hover:scale-105 transition-all"
              >
                Deposit Funds <Plus className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleActionClick('withdraw')}
                className="btn-pill border border-black/10 text-black/60 px-8 h-12 text-sm font-540 hover:bg-black/5 transition-all flex items-center gap-2 group hover:scale-105"
              >
                Withdraw Assets <Zap className="w-4 h-4" />
              </button>
           </div>
        </motion.div>
      </section>

      {/* 🚀 MERCHANT ONBOARDING */}
      {role === 'customer' && (
        <section className="bg-black/5 rounded-container p-12 lg:p-20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] -mr-40 -mt-40 transition-all group-hover:bg-purple-500/10" />
          
          <div className="max-w-2xl relative z-10">
            <span className="mono-label text-purple-600 mb-6 block tracking-mono-small font-700">Protocol Expansion</span>
            <h2 className="text-[48px] font-340 leading-[1.1] tracking-heading text-black mb-8 italic">
              Become a <span className="not-italic font-540">Merchant</span>.
            </h2>
            <p className="text-xl font-320 text-black/50 leading-relaxed tracking-body mb-12">
              Claim your Merchant Capability to start accepting decentralized recurring payments from any Sui wallet.
            </p>
            
            <button 
              onClick={registerAsMerchant}
              disabled={isRegistering}
              className="btn-pill-black h-14 px-10 text-base flex items-center gap-3 transition-all hover:scale-105"
            >
              {isRegistering ? 'Registering...' : 'Claim Merchant Identity'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      )}

      {/* 📋 SUBSCRIPTION REGISTRY */}
      <section>
        <motion.div {...reveal} className="mb-12 flex justify-between items-end">
          <div>
            <span className="mono-label text-black/60 mb-4 block tracking-mono-small uppercase">Authorized Permissions</span>
            <h3 className="text-4xl font-400 italic tracking-heading">Active Subscriptions.</h3>
          </div>
          <div className="font-mono text-[11px] text-black/60 uppercase tracking-mono-small mb-2">
            Total Registry: {userSubscriptions.length}
          </div>
        </motion.div>

        <motion.div {...reveal} className="border border-black/10 rounded-container overflow-hidden">
           {isLoadingSubs ? (
              <div className="py-20 text-center font-mono text-[11px] text-black/20 uppercase tracking-mono">Scanning Protocol Layer...</div>
           ) : userSubscriptions.length === 0 ? (
              <div className="py-24 text-center">
                 <p className="text-black/30 font-320 italic mb-8">No active pull-permissions detected on-chain.</p>
                 <button className="text-[11px] font-mono uppercase tracking-widest text-black/60 hover:text-black transition-colors flex items-center gap-2 mx-auto">
                   How to subscribe <ArrowRight className="w-3 h-3" />
                 </button>
              </div>
           ) : (
             <div className="overflow-x-auto">
               <table className="w-full text-left font-330">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-black/10">
                      <th className="py-6 px-10 font-mono text-[11px] uppercase tracking-mono-small text-black">Merchant Identity</th>
                      <th className="py-6 px-10 font-mono text-[11px] uppercase tracking-mono-small text-black text-center">Authorization</th>
                      <th className="py-6 px-10 font-mono text-[11px] uppercase tracking-mono-small text-black text-center">Flow Rate</th>
                      <th className="py-6 px-10 font-mono text-[11px] uppercase tracking-mono-small text-black text-right">Last Execution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userSubscriptions.map((sub, i) => {
                      const fields = sub.data?.content?.fields;
                      const nextPull = new Date(Number(fields?.last_pull_timestamp_ms) + Number(fields?.period_ms)).toLocaleDateString();
                      return (
                        <tr key={i} className="group hover:bg-gray-50/30 transition-colors border-b border-black/[0.08] last:border-0">
                           <td className="py-10 px-10 font-540 text-black flex items-center gap-4">
                              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white text-xs font-700 italic">
                                {fields?.merchant?.slice(2, 4).toUpperCase()}
                              </div>
                              <span className="tracking-tightest">0x{fields?.merchant?.slice(2, 8)}...{fields?.merchant?.slice(-4)}</span>
                           </td>
                           <td className="py-10 px-10 text-center">
                              <span className="inline-flex items-center gap-2 text-[10px] font-700 uppercase tracking-widest bg-black text-white px-3 py-1 rounded-full">Active Limit</span>
                           </td>
                           <td className="py-10 px-10 text-center font-540 italic text-black">
                              {(Number(fields?.amount_per_period) / 1000000000).toFixed(2)} <span className="text-[10px] text-black/40 font-mono not-italic uppercase ml-1">SUI / Period</span>
                           </td>
                           <td className="py-10 px-10 text-right">
                              <div className="text-sm font-540 tracking-tightest mb-1 text-black">{nextPull}</div>
                              <div className="text-[10px] font-mono text-black/40 uppercase tracking-mono">Scheduled Pull</div>
                           </td>
                        </tr>
                      );
                    })}
                  </tbody>
               </table>
             </div>
           )}
        </motion.div>
      </section>

      {/* 🛡️ SECURITY STATEMENT footer for dashboard */}
      <section className="py-20 border-t border-black/5">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="flex items-center gap-8">
               <div className="w-16 h-16 border border-black/5 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-black/20" />
               </div>
               <p className="text-sm font-320 text-black/40 leading-relaxed tracking-body italic">
                 Vault security is enforced by Sui's object-centric Move model. Your private key is never required for automated pull payments once authorized.
               </p>
            </div>
            <div className="flex justify-end gap-12 font-mono text-[11px] text-black/20 uppercase tracking-mono-small">
               <div>Protocol v1.02</div>
               <div>Isolated Storage</div>
               <div>Gas-efficient Execution</div>
            </div>
         </div>
      </section>
    </div>
  );
}
