import { useState, useEffect } from 'react';
import './Pages.css';

const ClientSide = ({ onBack }) => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula carga de datos (se ejecuta después del render)
    console.log('ClientSide: Cargando datos...');
    
    setTimeout(() => {
      fetch('/api/datos')
        .then(response => response.json())
        .then(data => {
          console.log('ClientSide: Datos recibidos', data);
          setDatos(data.items);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error:', error);
          setLoading(false);
        });
    }, 1000); // Simula delay de red
  }, []);

  return (
    <div className="page">
      <header className="page-header">
        <button onClick={onBack} className="back-btn">← Volver</button>
        <h1>⚡ Client-Side Rendering</h1>
      </header>

      <div className="page-content">
        <div className="info-box">
          <p><strong>CSR:</strong> Los datos se cargan después de que el componente se monta.</p>
          <p>Primero ves el HTML, luego JavaScript carga los datos.</p>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando datos...</p>
          </div>
        ) : (
          <div className="data-grid">
            {datos.map(item => (
              <div key={item.id} className="data-card">
                <h3>{item.nombre}</h3>
                <p>{item.descripcion}</p>
                <span className="badge">ID: {item.id}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientSide;