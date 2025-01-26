import { constantEnvs } from "@/core/constants/env.const";
import { openDB } from "idb";

const { DB_NAME, DB_VERSION } = constantEnvs;
export const initDB = async () => {
  try {
    return await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("reservations")) {
          db.createObjectStore("reservations", {
            keyPath: "id",
            autoIncrement: true,
          });
        }

        if (!db.objectStoreNames.contains("quotations")) {
          db.createObjectStore("quotations", {
            keyPath: "id",
            autoIncrement: true,
          });
        }

        if (!db.objectStoreNames.contains("hotelRoomQuotation")) {
          db.createObjectStore("hotelRoomQuotation", {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      },
    });
  } catch (error) {
    console.error("Failed to initialize IndexedDB:", error);
    throw error;
  }
};

