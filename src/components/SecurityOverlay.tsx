import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Lock } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

interface SecurityOverlayProps {
  onReset: () => void;
  violationCount: number;
  isViolated: boolean;
  setIsViolated: (val: boolean) => void;
}

export function SecurityOverlay({ onReset, violationCount, isViolated, setIsViolated }: SecurityOverlayProps) {
  const [unlockPassword, setUnlockPassword] = useState('');
  const [showUnlock, setShowUnlock] = useState(false);

  const handleUnlock = () => {
    if (unlockPassword === 'guru123') {
      setIsViolated(false);
      setUnlockPassword('');
      setShowUnlock(false);
      onReset();
    } else {
      toast.error('Password Salah');
    }
  };

  if (!isViolated) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl p-6"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="max-w-md w-full bg-zinc-900 border border-red-500/50 rounded-2xl p-8 text-center shadow-2xl shadow-red-500/20"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-500/10 rounded-full animate-pulse">
              <Lock className="w-12 h-12 text-red-500" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">UJIAN TERKUNCI</h2>
          <p className="text-zinc-400 mb-6">
            Sistem mendeteksi aktivitas mencurigakan (keluar aplikasi/split screen). 
            Layar ini hanya bisa dibuka oleh pengawas.
          </p>

          <div className="bg-zinc-800/50 rounded-xl p-4 mb-8 border border-zinc-700">
            <p className="text-sm text-zinc-500 uppercase tracking-wider font-semibold mb-1">Pelanggaran Terdeteksi</p>
            <p className="text-4xl font-mono font-bold text-red-400">{violationCount}</p>
          </div>

          {!showUnlock ? (
            <Button 
              variant="outline" 
              className="w-full h-12 text-zinc-400 border-zinc-700 hover:bg-zinc-800"
              onClick={() => setShowUnlock(true)}
            >
              Buka Kunci (Pengawas)
            </Button>
          ) : (
            <div className="space-y-4">
              <Input 
                type="password" 
                placeholder="Password Pengawas" 
                className="bg-zinc-800 border-zinc-700 text-white h-12 text-center"
                value={unlockPassword}
                onChange={(e) => setUnlockPassword(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  className="flex-1 text-zinc-500"
                  onClick={() => setShowUnlock(false)}
                >
                  Batal
                </Button>
                <Button 
                  className="flex-1 bg-white text-black hover:bg-zinc-200"
                  onClick={handleUnlock}
                >
                  Buka Sekarang
                </Button>
              </div>
            </div>
          )}
          
          <p className="mt-6 text-[10px] text-zinc-600 uppercase tracking-widest">
            ID Perangkat: {Math.random().toString(36).substring(7).toUpperCase()}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
