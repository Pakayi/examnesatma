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

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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
      toast.error('Gagal masuk ke mode layar penuh. Pastikan browser mendukung.');
      // Still start even if fullscreen fails in some environments
      setIsStarted(true);
    }
  };

  const exitExam = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setIsStarted(false);
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
                <p className="text-xs text-zinc-400">Exambro v1.0 • SMPN 1 Manonjaya</p>
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
    <div className="fixed inset-0 bg-white z-50 flex flex-col" ref={containerRef}>
      {/* Security Monitoring */}
      <SecurityOverlay onReset={() => {}} />

      {/* Header Bar (Optional, can be hidden for more space) */}
      <div className="h-12 bg-zinc-900 text-white flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-green-400" />
          <span className="text-sm font-bold tracking-tight uppercase">{schoolName} - EXAMBRO</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-mono uppercase tracking-widest">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Sistem Terpantau
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-white hover:bg-white/10"
            onClick={exitExam}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
          </Button>
        </div>
      </div>

      {/* Exam Content */}
      <div className="flex-1 relative bg-zinc-100">
        {!isFullscreen && isStarted && (
          <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 text-center">
            <div className="max-w-md space-y-6">
              <Maximize2 className="w-16 h-16 text-white mx-auto animate-bounce" />
              <h2 className="text-2xl font-bold text-white">Mode Layar Penuh Diperlukan</h2>
              <p className="text-zinc-400">Anda harus berada dalam mode layar penuh untuk mengerjakan ujian.</p>
              <Button onClick={() => containerRef.current?.requestFullscreen()} className="bg-white text-black hover:bg-zinc-200">
                Kembali ke Layar Penuh
              </Button>
            </div>
          </div>
        )}
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
