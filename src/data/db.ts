import { constantEnvs } from '@/core/constants/env.const';
import { openDB } from 'idb';

const { DB_NAME, DB_VERSION } = constantEnvs;

console.log('DB_NAME', DB_NAME);

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('reservations')) {
        db.createObjectStore('reservations', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}; 