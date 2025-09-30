import { useState } from 'react';
import Splash from './components/Splash';
import Home from './components/Home';
import ClientSide from './pages/ClientSide';
import ServerSide from './pages/ServerSide';
import Offline from './pages/Offline';
import Notifications from './pages/Notifications';
import Device from './pages/Device';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState('home');

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleBack = () => {
    setCurrentView('home');
  };

  if (showSplash) {
    return <Splash onFinish={handleSplashFinish} />;
  }

  const validViews = ['home', 'client-side', 'server-side', 'offline', 'notifications', 'device'];

  return (
    <div className="app">
      {currentView === 'home' && <Home onNavigate={handleNavigate} />}
      {currentView === 'client-side' && <ClientSide onBack={handleBack} />}
      {currentView === 'server-side' && <ServerSide onBack={handleBack} />}
      {currentView === 'offline' && <Offline onBack={handleBack} />}
      {currentView === 'notifications' && <Notifications onBack={handleBack} />}
      {currentView === 'device' && <Device onBack={handleBack} />}
      {!validViews.includes(currentView) && (
        <div style={{ padding: '20px', textAlign: 'center', color: 'white' }}>
          <h2>Vista: {currentView}</h2>
          <button onClick={handleBack}>Volver al Home</button>
        </div>
      )}
    </div>
  );
}

export default App;