import { useState, useEffect } from 'react';
import './Home.css';

const Home = ({ onNavigate }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [puedeInstalar, setPuedeInstalar] = useState(false);

  useEffect(() => {
    // Capturar el evento de instalación
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPuedeInstalar(true);
      console.log('PWA puede ser instalada');
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Verificar si ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('PWA ya está instalada');
      setPuedeInstalar(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const solicitarInstalacion = async () => {
    if (!deferredPrompt) {
      alert('La app ya está instalada o no se puede instalar en este dispositivo');
      return;
    }

    // Mostrar el prompt de instalación
    deferredPrompt.prompt();

    // Esperar la respuesta del usuario
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Usuario aceptó instalar la PWA');
      alert('¡Aplicación instalada con éxito! 🎉');
    } else {
      console.log('Usuario rechazó instalar la PWA');
    }

    // Limpiar el prompt
    setDeferredPrompt(null);
    setPuedeInstalar(false);
  };

  return (
    <div className="home">
      <header className="home-header">
        <h1>🚀 Mi PWA</h1>
        <p>Aplicación Web Progresiva</p>
      </header>

      <div className="home-cards">
        <div className="card" onClick={() => onNavigate('client-side')}>
          <div className="card-icon">⚡</div>
          <h3>Vista Cliente</h3>
          <p>Renderizado del lado del cliente (CSR)</p>
        </div>

        <div className="card" onClick={() => onNavigate('server-side')}>
          <div className="card-icon">🖥️</div>
          <h3>Vista Servidor</h3>
          <p>Renderizado del lado del servidor (SSR)</p>
        </div>

        <div className="card" onClick={() => onNavigate('offline')}>
          <div className="card-icon">📦</div>
          <h3>Datos Offline</h3>
          <p>Funciona sin conexión</p>
        </div>

        <div className="card" onClick={() => onNavigate('notifications')}>
          <div className="card-icon">🔔</div>
          <h3>Notificaciones</h3>
          <p>Push notifications</p>
        </div>

        <div className="card" onClick={() => onNavigate('device')}>
          <div className="card-icon">📱</div>
          <h3>Hardware</h3>
          <p>Cámara, GPS, etc.</p>
        </div>

        <div 
          className={`card ${puedeInstalar ? 'install-available' : 'install-disabled'}`}
          onClick={solicitarInstalacion}
        >
          <div className="card-icon">⬇️</div>
          <h3>Instalar App</h3>
          <p>
            {puedeInstalar 
              ? 'Agrega a pantalla de inicio' 
              : 'Ya instalada o no disponible'
            }
          </p>
        </div>
      </div>

      <footer className="home-footer">
        <p>PWA con React + Vite</p>
      </footer>
    </div>
  );
};

export default Home;