import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { SecurityOverlay } from '@/src/components/SecurityOverlay';
import { Maximize2, Settings as SettingsIcon, ShieldCheck, Info, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function Exam() {
  const navigate = useNavigate();
  const [examUrl, setExamUrl] = useState('');
  const [schoolName, setSchoolName] = useState('SMPN 1 Manonjaya');
  const [examTitle, setExamTitle] = useState('Ujian Sumatif Akhir Jenjang');
  const [isStarted, setIsStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isViolated, setIsViolated] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUrl = localStorage.getItem('exambro_url');
    const savedSchool = localStorage.getItem('exambro_school');
    const savedTitle = localStorage.getItem('exambro_title');
    if (savedUrl) setExamUrl(savedUrl);
    if (savedSchool) setSchoolName(savedSchool);
    if (savedTitle) setExamTitle(savedTitle);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleVisibilityChange = () => {
      if (isStarted && document.visibilityState === 'hidden') {
        triggerViolation();
      }
    };

    const handleBlur = () => {
      if (isStarted && !isViolated) {
        triggerViolation();
      }
    };

    const handleFocus = () => {
      // If they come back, and they were violated, make sure the overlay is still there
      if (isStarted && isViolated) {
        // Re-request fullscreen to trap them again
        containerRef.current?.requestFullscreen().catch(() => {});
      }
    };

    const handleResize = () => {
      // Detect split screen or floating window
      if (isStarted && isFullscreen) {
        const threshold = 50; // px
        if (Math.abs(window.innerWidth - screen.width) > threshold || 
            Math.abs(window.innerHeight - screen.height) > threshold) {
          triggerViolation();
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('resize', handleResize);
    };
  }, [isStarted, isFullscreen, isViolated]);

  const triggerViolation = () => {
    setIsViolated(true);
    setViolationCount((prev) => prev + 1);
    toast.error('Pelanggaran Terdeteksi!', {
      description: 'Layar terkunci. Hubungi pengawas.',
    });
  };

  const startExam = async () => {
    if (!examUrl) {
      toast.error('URL Ujian belum dikonfigurasi oleh Guru');
      return;
    }

    try {
      if (containerRef.current) {
        await containerRef.current.requestFullscreen();
        setIsStarted(true);
      }
    } catch (err) {
      toast.error('Gagal masuk ke mode layar penuh.');
      setIsStarted(true);
    }
  };

  const exitExam = () => {
    const pass = prompt('Masukkan Password Pengawas untuk keluar:');
    if (pass === 'guru123') {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      setIsStarted(false);
      setIsViolated(false);
    } else {
      alert('Password Salah!');
    }
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6" ref={containerRef}>
        <div className="w-full max-w-2xl space-y-8 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-zinc-900 uppercase">{schoolName}</h1>
            <p className="text-xl text-zinc-500 font-medium">{examTitle}</p>
          </div>

          <Card className="border-zinc-200 shadow-xl overflow-hidden bg-white">
            <CardContent className="p-0">
              <div className="p-8 space-y-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center text-white shadow-lg">
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Siap Memulai Ujian?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                      <Maximize2 className="w-5 h-5 text-zinc-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">Layar Penuh</p>
                        <p className="text-xs text-zinc-500">Ujian akan berjalan dalam mode layar penuh.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                      <Info className="w-5 h-5 text-zinc-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">Anti-Curang</p>
                        <p className="text-xs text-zinc-500">Pindah tab atau aplikasi akan terdeteksi.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full h-14 text-xl font-bold bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-all active:scale-95"
                  onClick={startExam}
                >
                  MULAI UJIAN SEKARANG
                </Button>
              </div>
              
              <div className="bg-zinc-50 p-4 border-t border-zinc-100 flex justify-between items-center">
                <p className="text-xs text-zinc-400">Exambro v1.1 • SMPN 1 Manonjaya</p>
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-900" onClick={() => navigate('/settings')}>
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Pengaturan Guru
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col select-none" ref={containerRef} onContextMenu={(e) => e.preventDefault()}>
      {/* Security Monitoring */}
      <SecurityOverlay 
        isViolated={isViolated} 
        setIsViolated={setIsViolated} 
        violationCount={violationCount}
        onReset={() => {
          if (containerRef.current && !document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(() => {});
          }
        }} 
      />

      {/* Header Bar - Minimized for security */}
      <div className="h-1 bg-zinc-900 shrink-0" />

      {/* Exam Content */}
      <div className="flex-1 relative bg-zinc-100">
        {!isFullscreen && isStarted && !isViolated && (
          <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 text-center">
            <div className="max-w-md space-y-6">
              <div className="p-4 bg-red-500/20 rounded-full w-fit mx-auto">
                <Maximize2 className="w-12 h-12 text-red-500 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Mode Layar Penuh Diperlukan</h2>
              <p className="text-zinc-400">Anda dilarang keluar dari mode layar penuh selama ujian berlangsung.</p>
              <Button onClick={() => containerRef.current?.requestFullscreen()} className="bg-white text-black hover:bg-zinc-200 h-12 px-8 font-bold">
                Kembali ke Layar Penuh
              </Button>
              <p className="text-[10px] text-zinc-600">Pelanggaran akan dicatat jika Anda sengaja keluar.</p>
            </div>
          </div>
        )}
        
        {/* Hidden Exit Button - Top Right Corner (Long Press / Multiple Clicks) */}
        <div 
          className="absolute top-0 right-0 w-12 h-12 z-30 opacity-0 hover:opacity-10 cursor-default"
          onDoubleClick={exitExam}
          title="Teacher Only"
        />

        <iframe 
          src={examUrl} 
          className="w-full h-full border-none"
          title="Exam Content"
          allow="geolocation; microphone; camera"
        />
      </div>
    </div>
  );
}
