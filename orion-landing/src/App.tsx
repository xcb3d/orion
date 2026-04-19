import { motion } from 'framer-motion';
import { ArrowRight, Shield } from 'lucide-react';
import { Header } from './components/Header';
import { StackGrid } from './components/StackGrid';

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.7, ease: [0.33, 1, 0.68, 1] as any }
};

export default function App() {
  return (
    <div className="bg-[#FAFAFA] font-sans selection:bg-black selection:text-white">
      <Header />

      {/* Hero Section */}
      <section id="home" className="relative h-[85vh] mx-8 mt-32 mb-4 rounded-container overflow-hidden bg-hero-gradient-animate flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center max-w-5xl px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] as any }}
          >
            <span className="mono-label text-white/70 mb-6 block tracking-mono-small uppercase">Decentralized Secrets Vault on Sui</span>
            <h1 className="text-[72px] md:text-[96px] font-400 leading-[0.95] tracking-display mb-10">
              The only vault<br />resistant to time.
            </h1>
            <p className="text-[20px] md:text-[22px] font-330 max-w-2xl mx-auto opacity-80 leading-relaxed mb-12 tracking-body">
              Securing the next billion secrets on Sui. Double-shielded encryption 
              powered by Argon2id and Walrus decentralized storage.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <button className="btn-pill bg-white text-black px-12 h-16 font-540 hover:scale-105 active:scale-95 transition-all w-full md:w-auto shadow-2xl shadow-white/10 uppercase tracking-tightest">
                Launch Private Vault
              </button>
              <button className="flex items-center gap-2 font-540 text-lg group opacity-80 hover:opacity-100 transition-opacity italic">
                Technical Whitepaper
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30 animate-bounce">
          <div className="w-[1px] h-12 bg-white" />
        </div>
      </section>

      {/* Editorial Statement */}
      <section className="py-40 px-8">
        <motion.div {...reveal} className="max-w-6xl mx-auto">
          <p className="text-[48px] font-340 leading-[1.25] tracking-heading text-black/80">
            Orion gives you <em className="font-540 text-black not-italic">Advanced AES-256</em> encryption. 
            Threshold decryption via Sui Seal, and 
            <em className="font-540 text-black not-italic"> Pure Autonomy</em> — no servers, no seed phrases.
          </p>
        </motion.div>
      </section>

      {/* Quantum Autonomy Section (Ported from Liquify style) */}
      <section id="security" className="mx-4 rounded-container bg-black text-white overflow-hidden mb-20 relative">
        {/* Ambient Glow */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#05f464]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] relative z-10">
          <motion.div {...reveal} className="p-16 lg:p-24 flex flex-col justify-center">
            <span className="mono-label text-white/70 mb-8 block tracking-mono-small uppercase border-l border-white/20 pl-4">01 — Pure Autonomy</span>
            <h2 className="text-5xl font-400 leading-[1.1] tracking-heading mb-8 italic">
              Your keys.<br />Your rules.
            </h2>
            <p className="text-lg font-320 text-white/50 leading-relaxed max-w-lg tracking-body">
              Encryption happens entirely on your device using Argon2id and AES-256. 
              Sealed and stored on Walrus, ensuring absolute privacy.
            </p>
          </motion.div>

          {/* Logic Preview - Simplified */}
          <motion.div {...reveal} className="p-16 lg:p-24 flex items-center justify-center border-l border-white/5">
            <div className="w-full max-w-md font-mono text-[13px] leading-[1.8] text-white/30 select-none">
              <div className="text-white/10 mb-4">{'// orion::vault v1'}</div>
              <div><span className="text-white/60">public fun</span> <span className="text-[#05f464]">seal</span>(</div>
              <div className="pl-6">secret: Vector&lt;u8&gt;,</div>
              <div className="pl-6">cipher: AesCipher</div>
              <div>) {'{'}</div>
              <div className="pl-6 text-white/10">// Encrypt with AES-256-GCM</div>
              <div className="pl-6 text-white/10">// Seal + Store on Walrus</div>
              <div>{'}'}</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid (Liquify Style) */}
      <StackGrid />

      {/* Mobile Experience / The App Preview */}
      <section id="infrastructure" className="mx-4 rounded-container bg-black text-white py-40 px-8 overflow-hidden relative">
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
          <motion.div {...reveal} className="lg:pr-12">
            <span className="mono-label text-white/70 mb-8 block uppercase border-l border-white/20 pl-4">03 — Infrastructure</span>
            <h2 className="text-6xl font-400 leading-[1.05] tracking-heading italic mb-10">
              Encryption at the edge.<br />Storage at scale.
            </h2>
            <p className="text-xl font-320 text-white/50 leading-relaxed tracking-body mb-16 max-w-lg">
              Your passwords never touch a server. The Walrus protocol guarantees 
              high-availability blob storage, while advanced encryption layers protect 
              your digital assets.
            </p>
            
            <div className="grid grid-cols-2 gap-10">
              <div>
                <h4 className="text-white font-540 mb-2 italic">Walrus Nodes</h4>
                <p className="text-white/30 text-sm font-330 tracking-body">Distributed shard storage.</p>
              </div>
              <div>
                <h4 className="text-white font-540 mb-2 italic">Sui Seal</h4>
                <p className="text-white/30 text-sm font-330 tracking-body">Programmable access policies.</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            {...reveal} 
            className="relative aspect-[4/5] bg-gradient-to-br from-white/10 to-transparent rounded-container border border-white/10 flex items-center justify-center group"
          >
             <div className="w-64 h-[450px] bg-white rounded-[32px] p-6 text-black relative shadow-2xl overflow-hidden scale-110">
                <div className="flex items-center justify-between mb-8 opacity-40">
                  <div className="w-12 h-2 bg-black rounded-full" />
                </div>
                <div className="space-y-6">
                  <div className="h-[2px] w-full bg-black/5" />
                  <div className="h-10 w-full bg-black rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-3 w-1/2 bg-black/10 rounded" />
                    <div className="h-8 w-full border border-black/5 rounded-lg" />
                  </div>
                  <div className="space-y-4 pt-4 border-t border-black/5">
                    {[1,2,3].map(i => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
                          <Lock className="w-3 h-3 opacity-20" />
                        </div>
                        <div className="h-2 w-24 bg-black/10 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="roadmap" className="py-60 text-center px-8 bg-white border-y border-black/5">
        <motion.div {...reveal} className="max-w-3xl mx-auto">
          <h2 className="text-7xl font-400 tracking-display italic mb-10 leading-none">Your digital legacy starts here.</h2>
          <p className="text-xl font-330 text-black/50 leading-relaxed mb-16 tracking-body px-4">
            Join the decentralized security revolution. Start managing your passwords 
            on the most resilient infrastructure ever built.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 font-540">
             <button className="btn-pill-black px-12 h-16 text-lg tracking-display w-full sm:w-auto hover:invert transition-all">
                Access Vault
             </button>
             <button className="px-12 h-16 text-lg tracking-display border border-black/10 rounded-pill hover:bg-black/5 transition-all w-full sm:w-auto uppercase tracking-tightest">
                Read Roadmap
             </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="mx-4 mb-4 rounded-container bg-black text-white py-24 px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-8 select-none">
                <Shield className="w-8 h-8 text-white" />
                <span className="text-2xl font-540 tracking-tightest italic">Orion</span>
              </div>
              <p className="text-xl font-320 text-white/40 leading-relaxed max-w-sm">
                The only secrets engine built for the age of decentralized autonomy. 
                Securing the next billion secrets on Sui.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              <div className="flex flex-col gap-6">
                <span className="mono-label text-white/20">Protocol</span>
                <a href="#security" className="text-[13px] font-450 text-white/60 hover:text-white transition-colors">Security</a>
                <a href="#technology" className="text-[13px] font-450 text-white/60 hover:text-white transition-colors">Technology</a>
                <a href="#infrastructure" className="text-[13px] font-450 text-white/60 hover:text-white transition-colors">Infrastructure</a>
              </div>
              <div className="flex flex-col gap-6">
                <span className="mono-label text-white/20">Social</span>
                <a href="#" className="text-[13px] font-450 text-white/60 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-[13px] font-450 text-white/60 hover:text-white transition-colors">Discord</a>
                <a href="#" className="text-[13px] font-450 text-white/60 hover:text-white transition-colors">GitHub</a>
              </div>
              <div className="flex flex-col gap-6">
                <span className="mono-label text-white/20">Legal</span>
                <a href="#" className="text-[13px] font-450 text-white/60 hover:text-white transition-colors">Privacy</a>
                <a href="#" className="text-[13px] font-450 text-white/60 hover:text-white transition-colors">Terms</a>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 gap-8">
            <span className="mono-label text-white/30 text-[10px]">© 2026 Orion Protocol. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Lock({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}
