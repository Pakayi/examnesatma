import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, AlertOctagon, Volume2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { toast } from 'sonner';

interface SecurityOverlayProps {
  onReset: () => void;
  violationCount: number;
  isViolated: boolean;
  setIsViolated: (val: boolean) => void;
}

export function SecurityOverlay({ onReset, violationCount, isViolated, setIsViolated }: SecurityOverlayProps) {
  const [unlockPassword, setUnlockPassword] = useState('');
  const [showUnlock, setShowUnlock] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Alarm sound effect (High pitched siren)
  useEffect(() => {
    if (isViolated) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/951/951-preview.mp3'); // Siren sound
      audio.loop = true;
      audio.volume = 1.0;
      audio.play().catch(e => console.log("Audio play blocked by browser policy. Interaction required."));
      audioRef.current = audio;
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isViolated]);

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
        className="fixed inset-0 z-[10000] flex items-center justify-center bg-red-600 p-6 overflow-hidden"
      >
        {/* Flashing Background Effect */}
        <motion.div 
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="absolute inset-0 bg-black"
        />

        <motion.div
          initial={{ scale: 0.8, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          className="relative max-w-md w-full bg-zinc-900 border-4 border-white rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(255,255,255,0.3)]"
        >
          <div className="flex justify-center mb-6">
            <div className="p-6 bg-red-500 rounded-full animate-bounce shadow-lg shadow-red-500/50">
              <AlertOctagon className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">PELANGGARAN!</h2>
          <p className="text-red-400 font-bold mb-6 animate-pulse">
            ALARM AKTIF - HUBUNGI PENGAWAS SEGERA
          </p>

          <div className="bg-white rounded-2xl p-6 mb-8">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-black mb-1">Pelanggaran Ke-{violationCount}</p>
            <div className="flex items-center justify-center gap-2">
              <Volume2 className="w-6 h-6 text-zinc-900 animate-pulse" />
              <p className="text-5xl font-mono font-black text-zinc-900">TERKUNCI</p>
            </div>
          </div>

          {!showUnlock ? (
            <Button 
              variant="default" 
              className="w-full h-16 text-xl font-black bg-white text-black hover:bg-zinc-200 rounded-xl shadow-lg"
              onClick={() => setShowUnlock(true)}
            >
              MATIKAN ALARM (GURU)
            </Button>
          ) : (
            <div className="space-y-4">
              <Input 
                type="password" 
                placeholder="PASSWORD GURU" 
                className="bg-zinc-800 border-2 border-zinc-700 text-white h-14 text-center text-2xl font-bold"
                value={unlockPassword}
                onChange={(e) => setUnlockPassword(e.target.value)}
                autoFocus
              />
              <div className="flex gap-3">
                <Button 
                  variant="ghost" 
                  className="flex-1 text-zinc-500 h-12"
                  onClick={() => setShowUnlock(false)}
                >
                  BATAL
                </Button>
                <Button 
                  className="flex-1 bg-red-500 text-white hover:bg-red-600 h-12 font-bold"
                  onClick={handleUnlock}
                >
                  BUKA KUNCI
                </Button>
              </div>
            </div>
          )}
          
          <div className="mt-8 flex items-center justify-center gap-2 text-zinc-500">
            <Lock className="w-3 h-3" />
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold">
              Secure System SMPN 1 Manonjaya
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
