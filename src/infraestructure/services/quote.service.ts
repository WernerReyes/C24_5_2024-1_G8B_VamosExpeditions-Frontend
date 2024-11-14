import { httpRequest } from "@/config";
import { QuoteEntity } from "@/domain/entities";

const PREFIX = "/quotes";

export const quoteService = {
  async getAll() {
    try {
      return await httpRequest.get<QuoteEntity[]>(`${PREFIX}`);
    } catch (error) {
      throw error;
    }
  }
};
