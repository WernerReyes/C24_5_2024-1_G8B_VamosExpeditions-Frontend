import { ReservationEntity } from "@/domain/entities";
import { initDB } from "../db";

export const reservationService = {
  async getReservations() {
    const db = await initDB();
    const tx = db.transaction("reservations", "readonly");
    const store = tx.objectStore("reservations");
    return store.getAll() as Promise<ReservationEntity[]>;
  },

  async registerReservation(reservation: ReservationEntity) {
    const db = await initDB();
    const tx = db.transaction("reservations", "readwrite");
    const store = tx.objectStore("reservations");

    //* Delete all reservations
    const allReservations = await store.getAll();
    allReservations.forEach((reservation) => store.delete(reservation.id));

    store.put(reservation);
    return tx.done;
  },

  async getCurrentReservation() {
    const db = await initDB();
    const tx = db.transaction("reservations", "readonly");
    const store = tx.objectStore("reservations");
    return store
      .getAll()
      .then((reservations) => reservations[0]) as Promise<ReservationEntity>;
  },

  //   async updateReservation(reservation) {
  //     const db = await initDB();
  //     const tx = db.transaction("reservations", "readwrite");
  //     const store = tx.objectStore("reservations");
  //     store.put(reservation);
  //     return tx.done;
  //   },
  async deleteReservation(id: number) {
    const db = await initDB();
    const tx = db.transaction("reservations", "readwrite");
    const store = tx.objectStore("reservations");
    store.delete(id);
    return tx.done;
  },
};
