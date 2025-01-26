import type { HotelRoomQuotationEntity } from "@/domain/entities";
import { initDB } from "../db";

export const hotelRoomQuotationService = {
  async upsertHotelRoomQuotation(hotelRoomQuotation: HotelRoomQuotationEntity) {
    const db = await initDB();
    const tx = db.transaction("hotelRoomQuotation", "readwrite");
    const store = tx.objectStore("hotelRoomQuotation");
      console.log(hotelRoomQuotation);
    store.add(hotelRoomQuotation);
    await tx.done;
  },

  async getCurrentHotelRoomsQuotation() {
    const db = await initDB();
    const tx = db.transaction("hotelRoomQuotation", "readonly");
    const store = tx.objectStore("hotelRoomQuotation");
    return store.getAll() as Promise<HotelRoomQuotationEntity[]>;
  },

  async deleteCurrentHotelRoomQuotation(id: number) {
    const db = await initDB();
    const tx = db.transaction("hotelRoomQuotation", "readwrite");
    const store = tx.objectStore("hotelRoomQuotation");
    store.delete(id);
  },
};
