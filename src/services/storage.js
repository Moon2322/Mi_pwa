// Servicio para manejar IndexedDB

const DB_NAME = 'MiPWA_DB';
const DB_VERSION = 1;
const STORE_NAME = 'items';

// Abrir/crear base de datos
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Crear object store si no existe
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        objectStore.createIndex('nombre', 'nombre', { unique: false });
        objectStore.createIndex('fecha', 'fecha', { unique: false });
      }
    };
  });
};

// Guardar item
export const guardarItem = async (item) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const itemConFecha = {
      ...item,
      fecha: new Date().toISOString()
    };
    
    const request = store.add(itemConFecha);

    request.onsuccess = () => {
      console.log('Item guardado:', request.result);
      resolve(request.result);
    };
    request.onerror = () => reject(request.error);
  });
};

// Obtener todos los items
export const obtenerItems = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      console.log('Items obtenidos:', request.result);
      resolve(request.result);
    };
    request.onerror = () => reject(request.error);
  });
};

// Eliminar item
export const eliminarItem = async (id) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      console.log('Item eliminado:', id);
      resolve(id);
    };
    request.onerror = () => reject(request.error);
  });
};

// Limpiar todo
export const limpiarTodo = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => {
      console.log('Base de datos limpiada');
      resolve();
    };
    request.onerror = () => reject(request.error);
  });
};