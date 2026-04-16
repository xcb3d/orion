import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.7, ease: [0.33, 1, 0.68, 1] }
};

export function LandingPage() {
  return (
    <div className="bg-[#FAFAFA]">

      {/* ═══════════════════════════════════════════════════
          HERO — Keep as is, it's already strong
      ═══════════════════════════════════════════════════ */}
      <section className="relative h-[85vh] m-4 rounded-container overflow-hidden bg-hero-gradient-animate flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 text-center max-w-5xl px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          >
            <span className="mono-label text-white/70 mb-6 block tracking-mono-small">Built for CommandOSS 2026</span>
            <h1 className="text-[86px] font-400 leading-[1.0] tracking-display mb-8">
              The subscription engine<br />built for the Sui economy.
            </h1>
            <p className="text-[20px] font-330 max-w-2xl mx-auto opacity-80 leading-relaxed mb-12 tracking-body">
              Deposit once. Authorize merchants. Payments flow automatically — secured entirely by Move smart contracts.
            </p>
            <div className="flex items-center justify-center gap-6">
              <Link to="/dashboard" className="btn-pill bg-white text-black px-10 h-14 font-540 hover:scale-105 active:scale-95 transition-all">
                Launch Dashboard
              </Link>
              <Link to="/merchant" className="flex items-center gap-2 font-540 text-lg group opacity-80 hover:opacity-100 transition-opacity">
                Merchant Portal
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
          EDITORIAL STATEMENT — Typography IS the design
      ═══════════════════════════════════════════════════ */}
      <section className="py-40 px-8">
        <motion.div {...reveal} className="max-w-6xl mx-auto">
          <p className="text-[48px] font-340 leading-[1.25] tracking-heading text-black/80">
            Liquify replaces manual invoicing with <em className="font-540 text-black not-italic">autonomous pull payments</em>. 
            A merchant gets a permission object. A keeper executes it. 
            The user's vault <em className="font-540 text-black not-italic">never exposes a private key</em>.
          </p>
        </motion.div>
      </section>


      {/* ═══════════════════════════════════════════════════
          THE VAULT — Full-width editorial feature
      ═══════════════════════════════════════════════════ */}
      <section className="mx-4 rounded-container bg-black text-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Left: Copy */}
          <motion.div {...reveal} className="p-16 lg:p-24 flex flex-col justify-center">
            <span className="mono-label text-white/30 mb-8 block tracking-mono-small">01 — Smart Vault</span>
            <h2 className="text-5xl font-400 leading-[1.1] tracking-heading mb-8 italic">
              Your funds.<br />Your rules.<br />Always.
            </h2>
            <p className="text-lg font-320 text-white/50 leading-relaxed max-w-md tracking-body">
              Users deposit SUI into a Move object they fully own. Subscriptions are separate permission objects — revocable at any time. The vault never transfers ownership.
            </p>
          </motion.div>

          {/* Right: Live code preview — real substance */}
          <motion.div {...reveal} className="p-16 lg:p-24 flex items-center justify-center border-l border-white/5">
            <div className="w-full max-w-md font-mono text-[13px] leading-[1.8] text-white/40 select-none">
              <div className="text-white/15 mb-4">{'// Move contract'}</div>
              <div><span className="text-white/70">module</span> liquify::vault {'{'}</div>
              <div className="pl-6">
                <div><span className="text-white/70">struct</span> <span className="text-[#05f464]">Vault</span> has key {'{'}</div>
                <div className="pl-6">
                  <div>id: <span className="text-white/60">UID</span>,</div>
                  <div>owner: <span className="text-white/60">address</span>,</div>
                  <div>balance: <span className="text-white/60">Balance&lt;SUI&gt;</span>,</div>
                </div>
                <div>{'}'}</div>
              </div>
              <div className="mt-4 pl-6">
                <div><span className="text-white/70">public fun</span> <span className="text-[#f4f105]">deposit</span>(</div>
                <div className="pl-6">vault: &mut Vault,</div>
                <div className="pl-6">coin: Coin&lt;SUI&gt;</div>
                <div>) {'{'}</div>
                <div className="pl-6 text-white/25">// Only owner can deposit</div>
                <div className="pl-6 text-white/25">// Balance stays in the object</div>
                <div>{'}'}</div>
              </div>
              <div>{'}'}</div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
          THE KEEPER — Asymmetric layout
      ═══════════════════════════════════════════════════ */}
      <section className="py-40 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          {/* Left narrow column */}
          <motion.div {...reveal} className="lg:col-span-4">
            <span className="mono-label text-black/20 mb-8 block tracking-mono-small">02 — Keepers</span>
            <h2 className="text-5xl font-400 leading-[1.1] tracking-heading italic mb-8">
              Payments that run themselves.
            </h2>
            <p className="text-lg font-330 text-black/40 leading-relaxed tracking-body mb-12">
              Keeper bots scan the blockchain for mature subscriptions and execute the pull transaction. Anyone can run a keeper.
            </p>
            <Link to="/dashboard" className="inline-flex items-center gap-3 text-sm font-540 border border-black rounded-pill px-6 py-3 hover:bg-black hover:text-white transition-all group">
              Try the Dashboard
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>

          {/* Right wide column — terminal log */}
          <motion.div {...reveal} className="lg:col-span-8 bg-gray-50 rounded-container p-12 lg:p-16">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-3 h-3 rounded-full bg-black/10" />
              <div className="w-3 h-3 rounded-full bg-black/10" />
              <div className="w-3 h-3 rounded-full bg-black/10" />
              <span className="ml-4 font-mono text-[11px] text-black/20 uppercase tracking-mono-small">keeper-node-01 — live output</span>
            </div>
            <div className="font-mono text-[13px] leading-[2.2] text-black/30 space-y-0">
              <div><span className="text-black/15">[14:04:31]</span> Scanning SubscriptionPermission objects...</div>
              <div><span className="text-black/15">[14:04:32]</span> Found <span className="text-black font-540">3</span> mature subscriptions ready for collection</div>
              <div><span className="text-black/15">[14:04:33]</span> Executing pull_payment for <span className="text-black/50">0x7281...a4f2</span></div>
              <div><span className="text-black/15">[14:04:35]</span> <span className="text-black">✓</span> Collected <span className="text-black font-540">0.50 SUI</span> → merchant <span className="text-black/50">0x6244...feed</span></div>
              <div><span className="text-black/15">[14:04:36]</span> Executing pull_payment for <span className="text-black/50">0x1192...c8e1</span></div>
              <div><span className="text-black/15">[14:04:38]</span> <span className="text-red-400">✗</span> Insufficient vault balance. Skipping. Retry in 24h.</div>
              <div><span className="text-black/15">[14:04:40]</span> Executing pull_payment for <span className="text-black/50">0x9f03...71b8</span></div>
              <div><span className="text-black/15">[14:04:42]</span> <span className="text-black">✓</span> Collected <span className="text-black font-540">0.25 SUI</span> → merchant <span className="text-black/50">0x6244...feed</span></div>
              <div><span className="text-black/15">[14:04:45]</span> Cycle complete. <span className="text-black font-540">2/3</span> successful. Sleeping 30s...</div>
              <div className="text-black/10 animate-pulse">_</div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
          MERCHANT — Numbers, not words
      ═══════════════════════════════════════════════════ */}
      <section className="mx-4 rounded-container bg-gray-50 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
          {/* Left: Simulated merchant data */}
          <motion.div {...reveal} className="p-16 lg:p-24 flex flex-col justify-center border-r border-black/5">
            <div className="space-y-8">
              <div className="flex items-baseline justify-between border-b border-black/5 pb-6">
                <span className="font-mono text-[11px] text-black/30 uppercase tracking-mono-small">Monthly Recurring Revenue</span>
                <span className="text-4xl font-540 tracking-tightest">1.25 <span className="text-lg font-330 text-black/30 italic">SUI</span></span>
              </div>
              <div className="flex items-baseline justify-between border-b border-black/5 pb-6">
                <span className="font-mono text-[11px] text-black/30 uppercase tracking-mono-small">Active Subscribers</span>
                <span className="text-4xl font-540 tracking-tightest">3</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[11px] text-black/30 uppercase tracking-mono-small">Collection Rate</span>
                <span className="text-4xl font-540 tracking-tightest">94.2<span className="text-lg font-330 text-black/30 italic">%</span></span>
              </div>
            </div>
          </motion.div>

          {/* Right: Copy */}
          <motion.div {...reveal} className="p-16 lg:p-24 flex flex-col justify-center">
            <span className="mono-label text-black/20 mb-8 block tracking-mono-small">03 — Merchant Hub</span>
            <h2 className="text-5xl font-400 leading-[1.1] tracking-heading italic mb-8">
              Revenue on autopilot.
            </h2>
            <p className="text-lg font-330 text-black/40 leading-relaxed tracking-body mb-12">
              Register once with your wallet. The protocol tracks every authorized subscriber, every collection, every missed payment — live, on-chain, verifiable.
            </p>
            <Link to="/merchant" className="inline-flex items-center gap-3 text-sm font-540 bg-black text-white rounded-pill px-8 py-4 hover:scale-105 active:scale-95 transition-all w-fit group">
              Open Merchant Hub
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
          HOW IT WORKS — Horizontal flow, not circles
      ═══════════════════════════════════════════════════ */}
      <section className="py-40 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div {...reveal} className="mb-24">
            <span className="mono-label text-black/20 mb-4 block tracking-mono-small">Protocol Flow</span>
            <h2 className="text-5xl font-400 italic tracking-heading">Three transactions. That's it.</h2>
          </motion.div>

          <motion.div {...reveal} className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-black/5 rounded-container overflow-hidden">
            {[
              {
                step: 'deposit( )',
                title: 'Fund your vault',
                desc: 'Transfer SUI from your wallet into a Move vault object you control.',
              },
              {
                step: 'authorize( )',
                title: 'Grant permission',
                desc: 'Create a SubscriptionPermission specifying the merchant, amount, and period.',
              },
              {
                step: 'pull_payment( )',
                title: 'Keeper collects',
                desc: 'When the period matures, any keeper can execute the payment on-chain.',
              },
            ].map((item, i) => (
              <div key={i} className={`p-12 lg:p-16 ${i < 2 ? 'border-b md:border-b-0 md:border-r border-black/5' : ''} group hover:bg-gray-50 transition-colors`}>
                <div className="font-mono text-[13px] text-black/20 tracking-mono mb-8">{item.step}</div>
                <h4 className="text-2xl font-540 mb-4 italic tracking-heading">{item.title}</h4>
                <p className="text-black/40 font-330 leading-relaxed tracking-body">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
          FINAL CTA — Grounded, not floating
      ═══════════════════════════════════════════════════ */}
      <section className="mx-4 mb-4 rounded-container bg-black text-white py-32 px-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[200px] -mt-80" />
        
        <motion.div {...reveal} className="relative z-10 max-w-2xl mx-auto">
          <span className="mono-label text-white/30 mb-8 block tracking-mono-small">Open Protocol</span>
          <h2 className="text-6xl font-400 tracking-heading italic mb-8">Start building on Liquify.</h2>
          <p className="text-lg font-320 text-white/40 leading-relaxed mb-12 tracking-body">
            Connect your Sui wallet to deposit, subscribe, or register as a merchant. The protocol is live on testnet.
          </p>
          <div className="flex items-center justify-center gap-6">
            <Link to="/dashboard" className="btn-pill bg-white text-black px-10 h-14 font-540 hover:scale-105 active:scale-95 transition-all">
              Launch Dashboard
            </Link>
            <Link to="/merchant" className="btn-pill border border-white/20 text-white px-10 h-14 font-540 hover:bg-white/10 transition-all">
              Merchant Hub
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
