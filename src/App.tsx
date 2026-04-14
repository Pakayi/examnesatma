import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/src/components/ui/sonner';
import Exam from './pages/Exam';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Exam />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <Toaster position="top-center" />
    </Router>
  );
}
