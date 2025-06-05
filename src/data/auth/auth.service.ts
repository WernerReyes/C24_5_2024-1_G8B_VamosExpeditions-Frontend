import { DeviceConnection } from "@/infraestructure/store/services/auth/auth.response";
import { initDB } from "../db";

export const authService = {
  async upsertDeviceConnection(deviceId: DeviceConnection["id"]) {
    const db = await initDB();
    const tx = db.transaction("deviceConnections", "readwrite");
    const store = tx.objectStore("deviceConnections");

    //* Delete all device connections
    const keys = await store.getAllKeys();
    await Promise.all(keys.map((key) => store.delete(key)));

    //* Add the new device connection
    await store.add({ id: deviceId });
  },

  async getDeviceConnection() {
    const db = await initDB();
    const tx = db.transaction("deviceConnections", "readonly");
    const store = tx.objectStore("deviceConnections");
    return store
      .getAll()
      .then((deviceConnections) => deviceConnections[0]) as Promise<
      DeviceConnection["id"]
    >;
  },
};
