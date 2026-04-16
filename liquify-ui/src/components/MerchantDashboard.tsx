import { motion } from 'framer-motion';
import { Signal, Zap, ShieldCheck, ArrowUpRight, Plus, Terminal } from 'lucide-react';
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { sdk } from '../services/sui';

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] }
};

export function MerchantDashboard() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const [mySubscribers, setMySubscribers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [merchantCapId, setMerchantCapId] = useState<string | null>(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [isAutoPilotActive, setIsAutoPilotActive] = useState<boolean | null>(null);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const OFFICIAL_KEEPER_ADDRESS = "0x624433c5ffd0ccd63b1a54a12f7360bcd95cef6c5efff33ac7ede0903454feed";

  const fetchSubscribers = async () => {
    if (!account) return;
    setIsLoading(true);
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

      const filtered = (response.data || []).filter((obj: any) => 
        obj.data?.content?.fields?.merchant === account.address ||
        obj.data?.content?.fields?.merchant === "0x624433c5ffd0ccd63b1a54a12f7360bcd95cef6c5efff33ac7ede0903454feed"
      );
      
      setMySubscribers(filtered);
    } catch (e) {
      console.error("Fetch subscribers error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
    fetchMerchantCap();
    checkAutomationStatus();
  }, [account]);

  const checkAutomationStatus = async () => {
    if (!account) return;
    try {
      const response = await client.getOwnedObjects({
        owner: OFFICIAL_KEEPER_ADDRESS,
        filter: {
          StructType: `${sdk.config.packageId}::suipay::KeeperCap`
        },
        options: {
          showContent: true
        }
      });

      const hasCap = (response.data || []).some((obj: any) => 
        obj.data?.content?.fields?.merchant === account.address
      );
      
      setIsAutoPilotActive(hasCap);
    } catch (e) {
      console.error("Check automation status error:", e);
    }
  };

  const fetchMerchantCap = async () => {
    if (!account) return;
    try {
      const response = await client.getOwnedObjects({
        owner: account.address,
        filter: {
          StructType: `${sdk.config.packageId}::suipay::MerchantCap`
        }
      });
      if (response.data && response.data.length > 0) {
        setMerchantCapId(response.data[0].data?.objectId || null);
      }
    } catch (e) {
      console.error("Fetch merchant cap error:", e);
    }
  };

  const authorizeKeeper = async () => {
    if (!account || !merchantCapId) return;
    setIsAuthorizing(true);
    try {
      const tx = sdk.buildIssueKeeperCapTx(merchantCapId, OFFICIAL_KEEPER_ADDRESS);
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log("Authorization Success:", result);
            toast.success("Automation authorized successfully!");
            // Short delay to allow chain indexing before re-check
            setTimeout(checkAutomationStatus, 2000);
          },
          onError: (err) => {
            console.error("Authorization Error:", err);
            toast.error(`Authorization failed: ${err.message}`);
          }
        }
      );
    } catch (e) {
      toast.error("Failed to build authorization transaction");
    } finally {
      setIsAuthorizing(false);
    }
  };

  const totalMRR = mySubscribers.reduce((acc: number, obj: any) => {
    return acc + (Number(obj.data?.content?.fields?.amount_per_period || 0) / 1000000000);
  }, 0);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSubscribers();
    setIsRefreshing(false);
    toast.success("Revenue analytics synchronized.");
  };

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center py-40 border border-black/5 rounded-container">
        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-10">
           <ShieldCheck className="w-10 h-10 text-black/10" />
        </div>
        <h2 className="text-4xl font-400 italic mb-4 tracking-heading">Merchant Command.</h2>
        <p className="text-black/30 text-center max-w-sm font-320 leading-relaxed tracking-body">
          Connect your merchant wallet to register on the protocol and track your decentralized cashflow.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-24 pb-40 relative">
      <div className="absolute top-40 right-40 w-96 h-96 bg-gray-200/10 rounded-full blur-[120px] pointer-events-none animation-delay-2000" />

      {/* 📈 HERO MRR STATEMENT */}
      <section>
        <motion.div {...reveal} className="max-w-4xl">
           <div className="flex items-center gap-3 mb-8">
              <span className="mono-label text-black/60 tracking-mono-small uppercase">Revenue Control</span>
              {isRefreshing && <Signal className="w-3 h-3 animate-pulse text-black/40" />}
           </div>
           <h2 className="text-[64px] font-340 leading-[1.1] tracking-heading text-black/80 mb-12">
             Generating <br />
             <span className="text-black font-540 not-italic">
               {totalMRR.toFixed(2)} SUI
             </span> in projected MRR.
           </h2>
           <div className="flex gap-4">
              <button className="btn-pill bg-black text-white px-8 h-12 text-sm font-540 flex items-center gap-2 group hover:scale-105 transition-all">
                Export Revenue Report <ArrowUpRight className="w-4 h-4" />
              </button>
              <button className="btn-pill border border-black/10 text-black/60 px-8 h-12 text-sm font-540 hover:bg-black/5 transition-all flex items-center gap-2 group">
                Download CSV
              </button>
           </div>
        </motion.div>
      </section>

      {/* 📊 REGISTRY TABLE */}
      <section>
        <motion.div {...reveal} className="mb-12 flex justify-between items-end">
          <div>
            <span className="mono-label text-black/60 mb-4 block tracking-mono-small">On-chain Subscriber Hub</span>
            <h3 className="text-4xl font-400 italic tracking-heading">Customer Registry.</h3>
          </div>
          <div className="font-mono text-[11px] text-black/60 uppercase tracking-mono-small mb-2">
            Active Nodes: {mySubscribers.length}
          </div>
        </motion.div>

        <motion.div {...reveal} className="border border-black/5 rounded-container overflow-hidden bg-white shadow-sm">
           <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-black/10">
                    <th className="py-6 px-10 font-mono text-[11px] uppercase tracking-mono-small text-black">Subscriber Wallet</th>
                    <th className="py-6 px-10 font-mono text-[11px] uppercase tracking-mono-small text-black text-center">Protocol Status</th>
                    <th className="py-6 px-10 font-mono text-[11px] uppercase tracking-mono-small text-black text-center">Subscription Rate</th>
                    <th className="py-6 px-10 font-mono text-[11px] uppercase tracking-mono-small text-black text-right">Last Collection</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                       <td colSpan={4} className="py-20 text-center font-mono text-[11px] text-black/10 uppercase tracking-mono">Querying Protocol Registry...</td>
                    </tr>
                  ) : mySubscribers.length === 0 ? (
                    <tr>
                       <td colSpan={4} className="py-24 text-center">
                          <p className="text-black/30 font-320 italic mb-8">No subscribers detected for this merchant identity.</p>
                          <button className="btn-pill border border-black/10 text-black/40 px-6 h-10 text-[10px] uppercase font-540">Generate Payment URL</button>
                       </td>
                    </tr>
                  ) : (
                    mySubscribers.map((sub: any, i: number) => {
                      const fields = sub.data?.content?.fields;
                      return (
                        <tr key={i} className="group hover:bg-gray-50/30 transition-colors border-b border-black/[0.08] last:border-0">
                           <td className="py-10 px-10 font-540 text-black tracking-tightest transition-colors">
                              {fields?.user || "Unknown Node"}
                           </td>
                           <td className="py-10 px-10 text-center">
                              <span className="inline-flex items-center gap-2 text-[10px] font-700 uppercase tracking-widest bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-200">Authorized</span>
                           </td>
                           <td className="py-10 px-10 text-center font-540 text-black">
                              {(Number(fields?.amount_per_period) / 1000000000).toFixed(2)} <span className="text-[10px] text-black/40 font-mono uppercase ml-1">SUI / Period</span>
                           </td>
                           <td className="py-10 px-10 text-right">
                              <div className="text-sm font-540 tracking-tightest mb-1 text-black">{new Date(Number(fields?.last_pull_timestamp_ms)).toLocaleDateString()}</div>
                              <div className="text-[10px] font-mono text-black/40 uppercase tracking-mono">Collected by Keeper</div>
                           </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
             </table>
           </div>
        </motion.div>
      </section>

      {/* 🤖 AUTOMATION CONTROL */}
      <section className="bg-black text-white rounded-container p-12 lg:p-20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] -mr-40 -mt-40 transition-all group-hover:bg-white/10" />
        
        <div className="max-w-2xl relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
               <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="mono-label text-white/40 tracking-mono-small uppercase">Protocol Automation</span>
          </div>

          <h2 className="text-[48px] font-340 leading-[1.1] tracking-heading mb-8 italic">
            Automate your <span className="not-italic font-540">Cashflow</span>.
          </h2>
          <p className="text-xl font-320 text-white/40 leading-relaxed tracking-body mb-12">
            Delegate a specialized <span className="text-white font-mono">KeeperCap</span> to the protocol's distributed network. 
            Once authorized, our keepers will pull payments for you 24/7.
          </p>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <button 
              onClick={authorizeKeeper}
              disabled={isAuthorizing || !merchantCapId || isAutoPilotActive === true}
              className="btn-pill bg-white text-black h-14 px-10 text-base font-540 flex items-center gap-3 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isAuthorizing ? 'Authorizing Cluster...' : isAutoPilotActive ? 'Automation Active' : 'Authorize Official Keeper'}
              {isAutoPilotActive ? <ShieldCheck className="w-5 h-5 text-green-600" /> : <ArrowUpRight className="w-5 h-5" />}
            </button>

            {isAutoPilotActive && (
              <div className="flex items-center gap-3 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                 <span className="text-[11px] font-mono text-green-500 uppercase tracking-mono-small">System Online</span>
              </div>
            )}
          </div>
          
          {!merchantCapId && (
            <p className="mt-4 text-[10px] font-mono text-white/20 uppercase tracking-mono">
              Identity verification required. MerchantCap not detected.
            </p>
          )}
        </div>
      </section>

      {/* 🤖 KEEPER TERMINAL */}
      <section className="bg-gray-50 rounded-container p-12 lg:p-16">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3 text-black/30">
            <Terminal className="w-5 h-5" />
            <span className="font-mono text-[11px] uppercase tracking-mono-small">Distributed Keeper Network Logs</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-black/20 uppercase tracking-mono">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Protocol Running
          </div>
        </div>

        <div className="font-mono text-[12px] leading-[2.2] text-black/40 space-y-1 italic max-h-60 overflow-y-auto pr-6 custom-scrollbar">
          <div>[14:22:01] 📡 Initializing Keeper Node #921... OK.</div>
          <div>[14:22:02] 🔍 Scanning Merchant Hub 0x{account.address.slice(2, 6)}... DONE.</div>
          <div>[14:22:03] 📜 Found <span className="text-black font-540 font-mono">{mySubscribers.length}</span> active subscription permission(s).</div>
          {mySubscribers.length > 0 ? (
            mySubscribers.map((sub, i) => (
              <div key={i}><span className="text-black/20">[{14+i}:22:0{4+i}]</span> Executing automatic pull for <span className="text-black/60">{sub.data?.content?.fields?.user.slice(0, 8)}...</span> → <span className="text-black">COLLECTED</span>.</div>
            ))
          ) : (
            <div>[14:22:04] 💤 No mature subscriptions to execute. Idling for 30s.</div>
          )}
          <div className="animate-pulse">_</div>
        </div>
      </section>

      {/* 🧱 INFRASTRUCTURE BLOCK */}
      <section className="py-20 border-t border-black/5 grid grid-cols-1 md:grid-cols-3 gap-16">
         <div>
            <h5 className="font-mono text-[11px] uppercase tracking-mono text-black/20 mb-6">Settlement Layer</h5>
            <p className="text-sm font-320 text-black/40 leading-relaxed tracking-body italic">
              All payments are settled directly on the Sui L1. No intermediate treasury.
            </p>
         </div>
         <div>
            <h5 className="font-mono text-[11px] uppercase tracking-mono text-black/20 mb-6">Automation Nodes</h5>
            <p className="text-sm font-320 text-black/40 leading-relaxed tracking-body italic">
              Liquify's network of keepers ensures that your revenue is collected even if you are offline.
            </p>
         </div>
         <div className="flex flex-col justify-between items-end">
            <Zap className="w-8 h-8 text-black/10" />
            <div className="text-[10px] font-mono text-black/20 tracking-mono uppercase">Merchant Node Online</div>
         </div>
      </section>
    </div>
  );
}
