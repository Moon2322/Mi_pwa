import { useState } from 'react';
import './Pages.css';

const Device = ({ onBack }) => {
  const [foto, setFoto] = useState(null);
  const [ubicacion, setUbicacion] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Tomar foto con la cámara
  const tomarFoto = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Cámara trasera en móviles
      });
      
      // Crear elemento video temporal
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      // Esperar a que el video esté listo
      video.onloadedmetadata = () => {
        // Crear canvas para capturar el frame
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        // Convertir a imagen
        const imagenURL = canvas.toDataURL('image/jpeg');
        setFoto(imagenURL);
        
        // Detener la cámara
        stream.getTracks().forEach(track => track.stop());
      };
    } catch (err) {
      console.error('Error al acceder a la cámara:', err);
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  };

  // Obtener ubicación GPS
  const obtenerUbicacion = () => {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización');
      return;
    }

    setCargando(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUbicacion({
          latitud: position.coords.latitude,
          longitud: position.coords.longitude,
          precision: position.coords.accuracy
        });
        setCargando(false);
      },
      (err) => {
        console.error('Error al obtener ubicación:', err);
        setError('No se pudo obtener la ubicación. Verifica los permisos.');
        setCargando(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  // Vibrar
  const vibrar = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    } else {
      setError('Tu dispositivo no soporta vibración');
    }
  };

  // Compartir (Web Share API)
  const compartir = async () => {
    if (!navigator.share) {
      setError('Tu navegador no soporta la API de compartir');
      return;
    }

    try {
      await navigator.share({
        title: 'Mi PWA',
        text: '¡Mira esta increíble PWA!',
        url: window.location.href
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error al compartir:', err);
      }
    }
  };

  // Copiar al portapapeles
  const copiarTexto = async () => {
    try {
      await navigator.clipboard.writeText('¡Texto copiado desde la PWA! 📋');
      alert('✅ Texto copiado al portapapeles');
    } catch (err) {
      setError('No se pudo copiar al portapapeles');
    }
  };

  // Detectar orientación
  const [orientacion, setOrientacion] = useState(
    window.screen.orientation?.type || 'desconocido'
  );

  const detectarOrientacion = () => {
    if (window.screen.orientation) {
      setOrientacion(window.screen.orientation.type);
      window.screen.orientation.addEventListener('change', () => {
        setOrientacion(window.screen.orientation.type);
      });
    } else {
      setError('API de orientación no disponible');
    }
  };

  // Información del dispositivo
  const infoDispositivo = {
    userAgent: navigator.userAgent,
    plataforma: navigator.platform,
    idioma: navigator.language,
    online: navigator.onLine,
    cookiesHabilitadas: navigator.cookieEnabled,
    pantallaAncho: window.screen.width,
    pantallaAlto: window.screen.height
  };

  return (
    <div className="page">
      <header className="page-header">
        <button onClick={onBack} className="back-btn">← Volver</button>
        <h1>📱 Hardware del Dispositivo</h1>
      </header>

      <div className="page-content">
        {error && (
          <div className="error-box">
            ⚠️ {error}
          </div>
        )}

        {/* Cámara */}
        <div className="device-section">
          <h3>📸 Cámara</h3>
          <button onClick={tomarFoto} className="btn-device">
            Tomar Foto
          </button>
          {foto && (
            <div className="foto-preview">
              <img src={foto} alt="Foto capturada" />
              <button onClick={() => setFoto(null)} className="btn-secondary">
                🗑️ Eliminar
              </button>
            </div>
          )}
        </div>

        {/* Geolocalización */}
        <div className="device-section">
          <h3>📍 Geolocalización (GPS)</h3>
          <button onClick={obtenerUbicacion} className="btn-device" disabled={cargando}>
            {cargando ? 'Obteniendo...' : 'Obtener Ubicación'}
          </button>
          {ubicacion && (
            <div className="ubicacion-info">
              <p><strong>Latitud:</strong> {ubicacion.latitud.toFixed(6)}</p>
              <p><strong>Longitud:</strong> {ubicacion.longitud.toFixed(6)}</p>
              <p><strong>Precisión:</strong> {ubicacion.precision.toFixed(2)}m</p>
              <a 
                href={`https://www.google.com/maps?q=${ubicacion.latitud},${ubicacion.longitud}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                🗺️ Ver en Google Maps
              </a>
            </div>
          )}
        </div>

        {/* Vibración */}
        <div className="device-section">
          <h3>📳 Vibración</h3>
          <button onClick={vibrar} className="btn-device">
            Vibrar
          </button>
          <p className="device-note">* Solo funciona en móviles</p>
        </div>

        {/* Compartir */}
        <div className="device-section">
          <h3>🔗 Compartir</h3>
          <button onClick={compartir} className="btn-device">
            Compartir App
          </button>
        </div>

        {/* Portapapeles */}
        <div className="device-section">
          <h3>📋 Portapapeles</h3>
          <button onClick={copiarTexto} className="btn-device">
            Copiar Texto
          </button>
        </div>

        {/* Orientación */}
        <div className="device-section">
          <h3>🔄 Orientación de Pantalla</h3>
          <button onClick={detectarOrientacion} className="btn-device">
            Detectar Orientación
          </button>
          <p className="device-value">Actual: <strong>{orientacion}</strong></p>
        </div>

        {/* Info del dispositivo */}
        <div className="device-section">
          <h3>ℹ️ Información del Dispositivo</h3>
          <div className="device-info">
            <p><strong>Plataforma:</strong> {infoDispositivo.plataforma}</p>
            <p><strong>Idioma:</strong> {infoDispositivo.idioma}</p>
            <p><strong>Estado:</strong> {infoDispositivo.online ? '🟢 Online' : '🔴 Offline'}</p>
            <p><strong>Pantalla:</strong> {infoDispositivo.pantallaAncho}x{infoDispositivo.pantallaAlto}</p>
            <p><strong>Cookies:</strong> {infoDispositivo.cookiesHabilitadas ? '✅' : '❌'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Device;