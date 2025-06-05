import { constantEnvs } from "@/core/constants/env.const";
import { openDB } from "idb";

const { DB_NAME, DB_VERSION } = constantEnvs;
export const initDB = async () => {
  try {
    return await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("quotations")) {
          db.createObjectStore("quotations", {
            keyPath: "id",
            autoIncrement: true,
          });
        }

        if (!db.objectStoreNames.contains("deviceConnections")) {
          db.createObjectStore("deviceConnections", {
            keyPath: "id",
          });
        }
      },
    });
  } catch (error) {
    console.error("Failed to initialize IndexedDB:", error);
    throw error;
  }
};
