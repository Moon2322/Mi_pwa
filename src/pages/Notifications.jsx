import { useState, useEffect } from 'react';
import { solicitarPermiso, mostrarNotificacion, verificarPermiso } from '../services/notifications';
import './Pages.css';

const Notifications = ({ onBack }) => {
  const [permiso, setPermiso] = useState(verificarPermiso());
  const [titulo, setTitulo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [programadas, setProgramadas] = useState([]);

  useEffect(() => {
    // Actualizar estado de permiso
    setPermiso(verificarPermiso());
  }, []);

  const handleSolicitarPermiso = async () => {
    const concedido = await solicitarPermiso();
    setPermiso(concedido ? 'granted' : 'denied');
  };

  const handleEnviarNotificacion = async (e) => {
    e.preventDefault();
    
    if (!titulo.trim()) {
      alert('Escribe un título');
      return;
    }

    await mostrarNotificacion(titulo, {
      body: mensaje || 'Sin mensaje',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png'
    });

    setTitulo('');
    setMensaje('');
  };

  const handleProgramar = (segundos) => {
    const id = Date.now();
    const tiempoFinal = Date.now() + (segundos * 1000);
    
    setProgramadas(prev => [...prev, {
      id,
      tiempo: segundos,
      tiempoFinal
    }]);

    setTimeout(async () => {
      await mostrarNotificacion(
        `⏰ Notificación Programada`,
        {
          body: `Han pasado ${segundos} segundos`,
          icon: '/icons/icon-192x192.png'
        }
      );
      setProgramadas(prev => prev.filter(n => n.id !== id));
    }, segundos * 1000);
  };

  const handleVibrar = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    } else {
      alert('Tu dispositivo no soporta vibración');
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <button onClick={onBack} className="back-btn">← Volver</button>
        <h1>🔔 Notificaciones</h1>
      </header>

      <div className="page-content">
        {/* Estado del permiso */}
        <div className={`info-box ${permiso === 'granted' ? 'online' : 'offline'}`}>
          <p>
            <strong>Estado del permiso:</strong> {' '}
            {permiso === 'granted' && '✅ Concedido'}
            {permiso === 'denied' && '❌ Denegado'}
            {permiso === 'default' && '⚠️ No solicitado'}
            {permiso === 'no-soportado' && '❌ No soportado'}
          </p>
          
          {permiso !== 'granted' && permiso !== 'no-soportado' && (
            <button onClick={handleSolicitarPermiso} className="btn-permission">
              Solicitar Permiso
            </button>
          )}
        </div>

        {/* Formulario de notificación */}
        {permiso === 'granted' && (
          <>
            <form onSubmit={handleEnviarNotificacion} className="form-notification">
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Título de la notificación"
                className="input-offline"
              />
              <textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Mensaje (opcional)"
                className="textarea-notification"
                rows="3"
              />
              <button type="submit" className="btn-agregar">
                📤 Enviar Notificación
              </button>
            </form>

            {/* Notificaciones rápidas */}
            <div className="quick-notifications">
              <h3>Notificaciones Rápidas</h3>
              <div className="quick-buttons">
                <button 
                  onClick={() => mostrarNotificacion('👋 Hola', { body: 'Esta es una notificación de prueba' })}
                  className="btn-quick"
                >
                  👋 Saludar
                </button>
                <button 
                  onClick={() => mostrarNotificacion('✅ Éxito', { body: 'Operación completada correctamente' })}
                  className="btn-quick success"
                >
                  ✅ Éxito
                </button>
                <button 
                  onClick={() => mostrarNotificacion('⚠️ Advertencia', { body: 'Revisa esta información' })}
                  className="btn-quick warning"
                >
                  ⚠️ Advertencia
                </button>
                <button 
                  onClick={() => mostrarNotificacion('❌ Error', { body: 'Algo salió mal' })}
                  className="btn-quick error"
                >
                  ❌ Error
                </button>
              </div>
            </div>

            {/* Notificaciones programadas */}
            <div className="scheduled-notifications">
              <h3>Notificaciones Programadas</h3>
              <div className="scheduled-buttons">
                <button onClick={() => handleProgramar(5)} className="btn-scheduled">
                  ⏰ En 5 seg
                </button>
                <button onClick={() => handleProgramar(10)} className="btn-scheduled">
                  ⏰ En 10 seg
                </button>
                <button onClick={() => handleProgramar(30)} className="btn-scheduled">
                  ⏰ En 30 seg
                </button>
              </div>

              {programadas.length > 0 && (
                <div className="programadas-list">
                  {programadas.map(n => (
                    <div key={n.id} className="programada-item">
                      ⏳ Notificación en {n.tiempo} segundos...
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Vibración */}
            <div className="vibration-section">
              <h3>Vibración del Dispositivo</h3>
              <button onClick={handleVibrar} className="btn-vibrate">
                📳 Vibrar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Notifications;