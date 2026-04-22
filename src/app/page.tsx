// Página principal — maneja la navegación entre encuesta y dashboard
'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import HeroStrip from '@/components/layout/HeroStrip';
import HeroSection from '@/components/ui/HeroSection';
import SurveyForm from '@/components/survey/SurveyForm';
import Dashboard from '@/components/dashboard/Dashboard';
import PasswordModal from '@/components/ui/PasswordModal';

export default function Home() {
  const [activePage, setActivePage] = useState<'form' | 'dash'>('form');
  const [showModal, setShowModal] = useState(false);
  const [sessionToken, setSessionToken] = useState('');

  // Verificar si hay sesión activa al cargar
  useEffect(() => {
    const saved = sessionStorage.getItem('30x_auth');
    if (saved) setSessionToken(saved);
  }, []);

  // Manejar navegación con protección de contraseña
  const handleNavigate = (page: 'form' | 'dash') => {
    if (page === 'dash') {
      if (sessionToken) {
        setActivePage('dash');
      } else {
        setShowModal(true);
      }
    } else {
      setActivePage('form');
    }
  };

  // Callback al autenticar correctamente
  const handleAuthSuccess = (token: string) => {
    setSessionToken(token);
    setShowModal(false);
    setActivePage('dash');
  };

  return (
    <main className="bg-black min-h-screen text-white overflow-x-hidden">
      {/* Barra de navegación */}
      <Navbar activePage={activePage} onNavigate={handleNavigate} />

      {/* Modal de contraseña */}
      {showModal && (
        <PasswordModal
          onSuccess={handleAuthSuccess}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Página de encuesta */}
      {activePage === 'form' && (
        <div>
          <HeroStrip />
          <HeroSection />
          <SurveyForm />
        </div>
      )}

      {/* Página de dashboard */}
      {activePage === 'dash' && sessionToken && (
        <Dashboard sessionToken={sessionToken} />
      )}
    </main>
  );
}
