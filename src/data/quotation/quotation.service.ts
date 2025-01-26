import type {
  QuotationEntity,
  VersionQuotationEntity
} from "@/domain/entities";
import { initDB } from "../db";

type LocalVersionQuotationEntity = Pick<VersionQuotationEntity, "id">;

export type LocalQuotationEntity = Pick<QuotationEntity, "id"> & {
  currentVersion: LocalVersionQuotationEntity & {};
};

export const quotationService = {
  async upsertQuotation(quotation: LocalQuotationEntity) {
    const db = await initDB();
    const tx = db.transaction("quotations", "readwrite");
    const store = tx.objectStore("quotations");

    //* Delete all quotations
    const keys = await store.getAllKeys();
    if (keys.length) {
      for (const key of keys) {
        store.delete(key);
      }
    }

    store.add(quotation);
    await tx.done;
  },

  async getCurrentQuotation() {
    const db = await initDB();
    const tx = db.transaction("quotations", "readonly");
    const store = tx.objectStore("quotations");
    return store
      .getAll()
      .then((quotations) => quotations[0]) as Promise<LocalQuotationEntity>;
  },

  async deleteCurrentQuotation() {
    const db = await initDB();
    const tx = db.transaction("quotations", "readwrite");
    const store = tx.objectStore("quotations");
    const keys = await store.getAllKeys();
    if (!keys.length) return tx.done;
    for (const key of keys) {
      store.delete(key);
    }
  },
};
