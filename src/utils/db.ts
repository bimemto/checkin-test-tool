interface IObjectStoreData {
  id: string;
  name: string;
  leave_appliances: any;
}

const DB_NAME = 'myDatabase';
const STORE_NAME = 'myObjectStore';

const openDB = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject('IndexedDB error');
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const objectStore = request.result.createObjectStore(STORE_NAME, {
        keyPath: 'id'
      });
      objectStore.createIndex('name', 'name', { unique: true });
    };
  });
};

const addObject = async (object: IObjectStoreData): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const objectStore = transaction.objectStore(STORE_NAME);
  objectStore.add(object);
};

const getObject = async (id: number): Promise<IObjectStoreData> => {
  const db = await openDB();
  return new Promise<IObjectStoreData>((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error(`Object with id ${id} not found`));
  });
};

const getAllObjects = async (): Promise<IObjectStoreData[]> => {
  const db = await openDB();
  return new Promise<IObjectStoreData[]>((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('No objects found'));
  });
};

const updateObject = async (
  id: number,
  object: IObjectStoreData
): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const objectStore = transaction.objectStore(STORE_NAME);
  const request = objectStore.put(object, id);
  request.onerror = () => console.log('Update object error');
};

const deleteObject = async (id: number): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const objectStore = transaction.objectStore(STORE_NAME);
  objectStore.delete(id);
};

const clearObjectStore = async (): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const objectStore = transaction.objectStore(STORE_NAME);
  objectStore.clear();
};

export default {
  addObject,
  getObject,
  updateObject,
  deleteObject,
  getAllObjects,
  clearObjectStore
};
