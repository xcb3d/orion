import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  type: 'deposit' | 'withdraw';
  maxAmount: number;
}

export function ActionModal({ isOpen, onClose, onConfirm, type, maxAmount }: ActionModalProps) {
  const [amount, setAmount] = useState<string>("1.0");
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount("1.0");
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    
    if (isNaN(val) || val <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (val > maxAmount) {
      setError(`Insufficient balance. Max available: ${maxAmount.toFixed(2)} SUI`);
      return;
    }

    onConfirm(val);
    onClose();
    setError(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed top-0 left-0 w-full h-full min-h-[100vh] min-w-[100vw] bg-black/40 backdrop-blur-md z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] pointer-events-none p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white border border-black/10 shadow-[0_16px_32px_-12px_rgba(0,0,0,0.1)] rounded-[32px] w-full max-w-md pointer-events-auto overflow-hidden"
            >
              <div className="p-10">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <span className="mono-label text-black/60 mb-3 block tracking-mono-small uppercase">Vault Operation</span>
                    <h3 className="text-3xl font-340 italic tracking-heading text-black">
                      {type === 'deposit' ? 'Authorize Deposit' : 'Withdrawal Request'}
                    </h3>
                  </div>
                  <button 
                    onClick={onClose}
                    className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-black/20" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                  <div>
                    <label className="block text-[11px] font-mono text-black/80 uppercase tracking-mono-small mb-4">
                      Amount in SUI
                    </label>
                    <div className="relative group">
                      <input 
                        autoFocus
                        type="number"
                        step="any"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-transparent border-b-2 border-black/10 focus:border-black text-[40px] font-540 tracking-tightest outline-none transition-all py-2 text-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0.00"
                        required
                        onChange={(e) => {
                          setAmount(e.target.value);
                          setError(null);
                        }}
                      />
                    </div>
                    {error ? (
                      <p className="mt-4 text-xs font-540 text-red-500 bg-red-50 py-2 px-4 rounded-lg border border-red-100 italic">
                        {error}
                      </p>
                    ) : (
                      <div className="mt-4 flex justify-between items-center text-[11px] font-mono uppercase tracking-mono-small">
                        <span className="text-black/40">Available Balance</span>
                        <span className="text-black font-700">{maxAmount.toFixed(2)} SUI</span>
                      </div>
                    )}
                    <p className="mt-4 text-[13px] font-320 text-black/60 leading-relaxed tracking-body italic">
                      {type === 'deposit' 
                        ? 'Funds will be moved to the isolated vault object for automated pull payments.' 
                        : 'Balance will be returned to your main wallet address instantly.'}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <button 
                      type="submit"
                      className="btn-pill-black w-full h-14 text-sm font-540 flex items-center justify-center gap-3 group"
                    >
                      Confirm Signature <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      type="button"
                      onClick={onClose}
                      className="w-full text-xs font-540 text-black/60 uppercase tracking-widest hover:text-black transition-colors py-2"
                    >
                      Discard Action
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
