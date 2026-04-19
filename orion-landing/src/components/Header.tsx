import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={twMerge(
        "fixed top-0 left-0 right-0 z-50 px-8 flex items-center justify-between transition-all duration-300",
        scrolled 
          ? "bg-white/80 backdrop-blur-md border-b border-black/5 py-4" 
          : "bg-white/40 backdrop-blur-sm border-b border-black/5 py-5"
      )}
    >
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 select-none text-black"
      >
        <Shield className="w-8 h-8" />
        <span className="text-xl font-540 tracking-tightest italic">Orion</span>
      </motion.div>

      <div className="hidden md:flex items-center gap-10 text-[11px] font-450 uppercase tracking-[0.2em] text-black/60">
        <a href="#home" className="hover:text-black transition-colors">Home</a>
        <a href="#security" className="hover:text-black transition-colors">Security</a>
        <a href="#technology" className="hover:text-black transition-colors">Tech</a>
        <a href="#infrastructure" className="hover:text-black transition-colors">Infra</a>
        <a href="#roadmap" className="hover:text-black transition-colors">Roadmap</a>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <button className="btn-pill-black !text-[12px] !px-6 !h-9 border-none hover:scale-105 active:scale-95 transition-all uppercase tracking-wider font-540">
          Connect Wallet
        </button>
      </motion.div>
    </nav>
  );
}
