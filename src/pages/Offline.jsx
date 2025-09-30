import { useState, useEffect } from 'react';
import { guardarItem, obtenerItems, eliminarItem, limpiarTodo } from '../services/storage';
import './Pages.css';

const Offline = ({ onBack }) => {
  const [items, setItems] = useState([]);
  const [nuevoItem, setNuevoItem] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Detectar conexión
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cargar items al montar
  useEffect(() => {
    cargarItems();
  }, []);

  const cargarItems = async () => {
    try {
      const itemsDB = await obtenerItems();
      setItems(itemsDB);
    } catch (error) {
      console.error('Error al cargar items:', error);
    }
  };

  const handleAgregar = async (e) => {
    e.preventDefault();
    if (!nuevoItem.trim()) return;

    try {
      await guardarItem({
        nombre: nuevoItem,
        descripcion: isOnline ? 'Guardado online' : 'Guardado offline'
      });
      setNuevoItem('');
      await cargarItems();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarItem(id);
      await cargarItems();
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const handleLimpiar = async () => {
    if (confirm('¿Eliminar todos los items?')) {
      try {
        await limpiarTodo();
        await cargarItems();
      } catch (error) {
        console.error('Error al limpiar:', error);
      }
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <button onClick={onBack} className="back-btn">← Volver</button>
        <h1>📦 Datos Offline</h1>
      </header>

      <div className="page-content">
        <div className={`info-box ${isOnline ? 'online' : 'offline'}`}>
          <p>
            <strong>Estado:</strong> {isOnline ? '🟢 Online' : '🔴 Offline'}
          </p>
          <p>Los datos se guardan en <strong>IndexedDB</strong> y funcionan sin conexión.</p>
          <p>Intenta desactivar tu conexión y seguirás pudiendo agregar/eliminar items.</p>
        </div>

        <form onSubmit={handleAgregar} className="form-offline">
          <input
            type="text"
            value={nuevoItem}
            onChange={(e) => setNuevoItem(e.target.value)}
            placeholder="Escribe algo..."
            className="input-offline"
          />
          <button type="submit" className="btn-agregar">
            ➕ Agregar
          </button>
        </form>

        <div className="actions">
          <button onClick={cargarItems} className="btn-secondary">
            🔄 Recargar
          </button>
          <button onClick={handleLimpiar} className="btn-danger">
            🗑️ Limpiar Todo
          </button>
        </div>

        <div className="items-list">
          {items.length === 0 ? (
            <p className="empty-state">No hay items guardados. ¡Agrega uno!</p>
          ) : (
            items.map(item => (
              <div key={item.id} className="item-card">
                <div className="item-info">
                  <h3>{item.nombre}</h3>
                  <p>{item.descripcion}</p>
                  <small>{new Date(item.fecha).toLocaleString()}</small>
                </div>
                <button 
                  onClick={() => handleEliminar(item.id)} 
                  className="btn-delete"
                >
                  ❌
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Offline;