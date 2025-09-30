import { useEffect } from 'react';
import './Splash.css';

const Splash = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="splash-logo">
          <h1>🚀</h1>
        </div>
        <h2>Mi PWA</h2>
        <div className="splash-author">
          <p>Aldo Luna</p>
          <p>UTEQ</p>
        </div>
        <div className="splash-loader">
          <div className="spinner"></div>
        </div>
      </div>
    </div>
  );
};

export default Splash;