import { useState, useEffect } from 'react';
import './Pages.css';

const ServerSide = ({ onBack }) => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    // Pre-carga inmediata (simula que vienen del servidor)
    console.log('ServerSide: Pre-cargando datos...');
    
    fetch('/api/datos')
      .then(response => response.json())
      .then(data => {
        console.log('ServerSide: Datos pre-cargados', data);
        setDatos(data.items);
      });
  }, []);

  // Renderiza inmediatamente con datos (simula SSR)
  return (
    <div className="page">
      <header className="page-header">
        <button onClick={onBack} className="back-btn">← Volver</button>
        <h1>🖥️ Server-Side Rendering</h1>
      </header>

      <div className="page-content">
        <div className="info-box server">
          <p><strong>SSR:</strong> Los datos están disponibles desde el primer render.</p>
          <p>En una app real, el servidor enviaría el HTML ya con datos.</p>
        </div>

        <div className="data-grid">
          {datos.length === 0 ? (
            <p>Cargando...</p>
          ) : (
            datos.map(item => (
              <div key={item.id} className="data-card server">
                <h3>{item.nombre}</h3>
                <p>{item.descripcion}</p>
                <span className="badge server">Pre-cargado</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ServerSide;