// Servicio para manejar notificaciones

export const solicitarPermiso = async () => {
  if (!('Notification' in window)) {
    alert('Tu navegador no soporta notificaciones');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const mostrarNotificacion = async (titulo, opciones = {}) => {
  const tienePermiso = await solicitarPermiso();
  
  if (!tienePermiso) {
    console.log('No hay permiso para notificaciones');
    return;
  }

  // Si hay Service Worker registrado, úsalo
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SHOW_NOTIFICATION',
      title: titulo,
      body: opciones.body || 'Nueva notificación',
      icon: opciones.icon || '/icons/icon-192x192.png'
    });
  } else {
    // Si no, crea notificación directa
    new Notification(titulo, {
      body: opciones.body || 'Nueva notificación',
      icon: opciones.icon || '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      vibrate: [200, 100, 200],
      ...opciones
    });
  }
};

export const verificarPermiso = () => {
  if (!('Notification' in window)) {
    return 'no-soportado';
  }
  return Notification.permission;
};