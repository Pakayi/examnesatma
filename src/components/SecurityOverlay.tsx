import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Lock } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

interface SecurityOverlayProps {
  onReset: () => void;
}

export function SecurityOverlay({ onReset }: SecurityOverlayProps) {
  const [isViolated, setIsViolated] = useState(false);
  const [violationCount, setViolationCount] = useState(0);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setIsViolated(true);
        setViolationCount((prev) => prev + 1);
      }
    };

    const handleBlur = () => {
      setIsViolated(true);
      setViolationCount((prev) => prev + 1);
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  if (!isViolated) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-6"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="max-w-md w-full bg-zinc-900 border border-red-500/50 rounded-2xl p-8 text-center shadow-2xl shadow-red-500/20"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-500/10 rounded-full">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Peringatan Keamanan!</h2>
          <p className="text-zinc-400 mb-6">
            Anda terdeteksi meninggalkan halaman ujian atau berpindah tab. 
            Hal ini dicatat sebagai pelanggaran sistem.
          </p>

          <div className="bg-zinc-800/50 rounded-xl p-4 mb-8 border border-zinc-700">
            <p className="text-sm text-zinc-500 uppercase tracking-wider font-semibold mb-1">Total Pelanggaran</p>
            <p className="text-3xl font-mono font-bold text-red-400">{violationCount}</p>
          </div>

          <Button 
            variant="destructive" 
            className="w-full h-12 text-lg font-semibold"
            onClick={() => setIsViolated(false)}
          >
            Lanjutkan Ujian
          </Button>
          
          <p className="mt-4 text-xs text-zinc-500">
            Sistem Exambro SMPN 1 Manonjaya memantau aktivitas Anda secara real-time.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
