import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShieldCheck, Lock, Zap } from 'lucide-react';
import { useState, useCallback } from 'react';

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.7, ease: [0.33, 1, 0.68, 1] as any }
};

const features = [
  {
    id: 'crypto',
    signature: 'vault_encrypt( )',
    title: 'Robust Encryption',
    desc: 'Industry-standard AES-256-GCM combined with Argon2id KDF protects your secrets. Client-side. Always.',
    Icon: ShieldCheck,
    accent: 'indigo'
  },
  {
    id: 'vault',
    signature: 'seal_vault( )',
    title: 'Sui Seal Gateway',
    desc: 'Threshold decryption across Sui validators — keys are split and only reassembled when on-chain policy is satisfied. No single point of failure.',
    Icon: Lock,
    accent: 'blue'
  },
  {
    id: 'zk',
    signature: 'zk_authenticate( )',
    title: 'zkLogin Identity',
    desc: 'Sign in with Google or Apple. Sui\'s zkLogin maps your existing identity to an on-chain address — no seed phrases, no extensions.',
    Icon: Zap,
    accent: 'teal'
  }
];

export function StackGrid() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Tilt transforms
  const rotateX = useTransform(smoothY, [0, 500], [2, -2]);
  const rotateY = useTransform(smoothX, [0, 500], [-2, 2]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  }, [mouseX, mouseY]);

  return (
    <section id="technology" className="py-40 px-8 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50/30 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <motion.div {...reveal} className="mb-20 text-center">
          <span className="mono-label text-black/40 mb-4 block tracking-mono-small uppercase border-l border-black/10 pl-4">02 — Core Technology</span>
          <h2 className="text-5xl md:text-6xl font-400 italic tracking-heading">Double-Shielded. Decentralized. Yours.</h2>
        </motion.div>

        <motion.div 
          {...reveal} 
          className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-black/5 rounded-container overflow-hidden bg-white/40 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.02)]"
        >
          {features.map((item, i) => (
            <motion.div 
              key={i} 
              onMouseMove={handleMouseMove}
              style={{
                rotateX: item.id === 'vault' ? rotateX : 0,
                rotateY: item.id === 'vault' ? rotateY : 0,
                transformStyle: "preserve-3d"
              }}
              className={`relative p-12 lg:p-14 ${i < 2 ? 'border-b md:border-b-0 md:border-r border-black/5' : ''} group transition-all duration-500 cursor-default overflow-hidden`}
            >
              {/* Feature Specific Backgrounds */}
              {item.id === 'crypto' && (
                <div className="absolute inset-0 lattice-grid opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              )}
              
              {item.id === 'zk' && (
                <motion.div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at ${smoothX}px ${smoothY}px, rgba(20, 184, 166, 0.08), transparent 70%)`
                  }}
                />
              )}

              {/* Accent Border (Bottom) */}
              <div className={`absolute bottom-0 left-0 w-full h-[2px] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-out z-20 
                ${item.accent === 'indigo' ? 'bg-indigo-400' : item.accent === 'blue' ? 'bg-blue-400' : 'bg-teal-400'}`} 
              />

              <div className="relative z-10 flex flex-col h-full pointer-events-none">
                <div className="flex items-center justify-between mb-8">
                  <div className={`font-mono text-[13px] tracking-mono transition-colors duration-300
                    ${item.accent === 'indigo' ? 'text-indigo-900/30 group-hover:text-indigo-600' : 
                      item.accent === 'blue' ? 'text-blue-900/30 group-hover:text-blue-600' : 
                      'text-teal-900/30 group-hover:text-teal-600'}`}>
                    {item.signature}
                  </div>
                  <item.Icon className={`w-5 h-5 transition-all duration-500 group-hover:scale-110 
                    ${item.accent === 'indigo' ? 'text-black/10 group-hover:text-indigo-500' : 
                      item.accent === 'blue' ? 'text-black/10 group-hover:text-blue-500' : 
                      'text-black/10 group-hover:text-teal-500'}`} 
                  />
                </div>
                
                <h4 className="text-2xl font-540 mb-4 italic tracking-heading text-black/90 group-hover:translate-x-1 transition-transform duration-500">
                  {item.title}
                </h4>
                
                <p className="text-black/40 font-330 leading-relaxed tracking-body text-base group-hover:text-black/60 transition-colors duration-500">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
