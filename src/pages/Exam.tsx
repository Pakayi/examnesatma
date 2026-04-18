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
    const defaultUrl = 'https://ayifauzi21-cyber.github.io/portalsajbk26/';
    const savedUrl = localStorage.getItem('exambro_url') || defaultUrl;
    const savedSchool = localStorage.getItem('exambro_school') || 'SMPN 1 Manonjaya';
    const savedTitle = localStorage.getItem('exambro_title') || 'Ujian Sumatif Akhir Jenjang';
    
    setExamUrl(savedUrl);
    setSchoolName(savedSchool);
    setExamTitle(savedTitle);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleVisibilityChange = () => {
      if (isStarted && document.visibilityState === 'hidden') {
        triggerViolation();
      }
    };

    const handleBlur = () => {
      // Removed triggerViolation from blur to prevent false positives 
      // when interacting with the iframe or browser UI.
      // visibilitychange is more reliable for app switching.
    };

    const handleFocus = () => {
      if (isStarted && isViolated) {
        containerRef.current?.requestFullscreen().catch(() => {});
      }
    };

    const handleResize = () => {
      // Detect split screen or floating window
      // Only trigger if the change is significant and we are started
      if (isStarted && isFullscreen) {
        const threshold = 100; // Increased threshold to 100px
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
      <div className="min-h-screen bg-linear-to-br from-blue-700 via-blue-800 to-indigo-950 flex flex-col items-center justify-center p-6 relative overflow-hidden" ref={containerRef}>
        {/* Decorative background elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="w-full max-w-2xl space-y-8 text-center relative z-10">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase drop-shadow-lg">
              {schoolName}
            </h1>
            <div className="h-1 w-24 bg-blue-400 mx-auto rounded-full" />
            <p className="text-xl text-blue-100 font-medium tracking-wide drop-shadow-md">
              {examTitle}
            </p>
          </div>

          <Card className="border-white/10 shadow-2xl overflow-hidden bg-white/95 backdrop-blur-sm rounded-3xl">
            <CardContent className="p-0">
              <div className="p-10 space-y-8">
                <div className="flex justify-center">
                  <div className="w-24 h-24 bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <ShieldCheck className="w-12 h-12" />
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-zinc-800">Siap Memulai Ujian?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="flex items-start gap-3 p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Maximize2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-zinc-900 leading-tight">Layar Penuh</p>
                        <p className="text-xs text-zinc-600 mt-1">Sistem akan mengunci layar secara otomatis.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Info className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-zinc-900 leading-tight">Sistem Keamanan</p>
                        <p className="text-xs text-zinc-600 mt-1">Dilarang berpindah aplikasi selama ujian.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full h-16 text-xl font-black bg-linear-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-2xl transition-all shadow-xl hover:shadow-blue-500/20 active:scale-95 border-b-4 border-indigo-900/30"
                  onClick={startExam}
                >
                  MULAI UJIAN SEKARANG
                </Button>
              </div>
              
              <div className="bg-zinc-50/50 p-4 border-t border-zinc-100 flex justify-between items-center px-8">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Exambro v1.3 • SMPN 1 Manonjaya</p>
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" onClick={() => navigate('/settings')}>
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Akses Guru</span>
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
