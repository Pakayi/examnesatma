import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Label } from '@/src/components/ui/label';
import { Switch } from '@/src/components/ui/switch';
import { Settings as SettingsIcon, Globe, Shield, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const navigate = useNavigate();
  const [examUrl, setExamUrl] = useState('');
  const [schoolName, setSchoolName] = useState('SMPN 1 Manonjaya');
  const [examTitle, setExamTitle] = useState('Ujian Sumatif Akhir Jenjang');
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const defaultUrl = 'https://pakayi.github.io/portalsaj/';
    const savedUrl = localStorage.getItem('exambro_url') || defaultUrl;
    const savedSchool = localStorage.getItem('exambro_school') || 'SMPN 1 Manonjaya';
    const savedTitle = localStorage.getItem('exambro_title') || 'Ujian Sumatif Akhir Jenjang';
    
    setExamUrl(savedUrl);
    setSchoolName(savedSchool);
    setExamTitle(savedTitle);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      toast.success('Akses Diberikan');
    } else {
      toast.error('Password Salah');
    }
  };

  const handleSave = () => {
    if (!examUrl) {
      toast.error('URL Ujian tidak boleh kosong');
      return;
    }
    
    // Add protocol if missing
    let finalUrl = examUrl;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    localStorage.setItem('exambro_url', finalUrl);
    localStorage.setItem('exambro_school', schoolName);
    localStorage.setItem('exambro_title', examTitle);
    toast.success('Pengaturan Berhasil Disimpan');
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-zinc-200 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-zinc-900 rounded-xl text-white">
                <Shield className="w-8 h-8" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Akses Guru</CardTitle>
            <CardDescription>Masukkan password untuk mengubah pengaturan ujian</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-zinc-900 hover:bg-zinc-800">
                Masuk
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-zinc-900">Pengaturan Exambro</h1>
          </div>
          <Button onClick={handleSave} className="bg-zinc-900 hover:bg-zinc-800 gap-2">
            <Save className="w-4 h-4" />
            Simpan
          </Button>
        </div>

        <Card className="border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="w-5 h-5 text-zinc-500" />
              Konfigurasi Link Ujian
            </CardTitle>
            <CardDescription>Tentukan website ujian yang akan ditampilkan kepada siswa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url">URL Website Ujian</Label>
              <Input 
                id="url" 
                placeholder="https://exam.google.com/..." 
                value={examUrl}
                onChange={(e) => setExamUrl(e.target.value)}
              />
              <p className="text-xs text-zinc-500 italic">Contoh: google.com atau https://exam-smpn1.com</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="school">Nama Sekolah</Label>
                <Input 
                  id="school" 
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Judul Ujian</Label>
                <Input 
                  id="title" 
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-zinc-500" />
              Keamanan & Fitur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg border border-zinc-100">
              <div className="space-y-0.5">
                <Label className="text-base">Anti-Tab Switching</Label>
                <p className="text-sm text-zinc-500">Kunci layar jika siswa mencoba pindah tab</p>
              </div>
              <Switch checked={true} disabled />
            </div>
            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg border border-zinc-100">
              <div className="space-y-0.5">
                <Label className="text-base">Mode Fullscreen Otomatis</Label>
                <p className="text-sm text-zinc-500">Paksa layar penuh saat ujian dimulai</p>
              </div>
              <Switch checked={true} disabled />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
