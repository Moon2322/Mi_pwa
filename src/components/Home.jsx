import { useState } from 'react';
import './Home.css';

const Home = ({ onNavigate }) => {
  const [instalado, setInstalado] = useState(false);

  const solicitarInstalacion = () => {
    // Esto lo implementaremos después
    alert('Funcionalidad de instalación próximamente');
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

        <div className="card" onClick={solicitarInstalacion}>
          <div className="card-icon">⬇️</div>
          <h3>Instalar App</h3>
          <p>Agrega a pantalla de inicio</p>
        </div>
      </div>

      <footer className="home-footer">
        <p>PWA con React + Vite</p>
      </footer>
    </div>
  );
};

export default Home;