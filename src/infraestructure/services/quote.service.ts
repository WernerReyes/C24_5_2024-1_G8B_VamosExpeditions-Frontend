// import { httpRequest } from "@/config";
import { QuoteEntity } from "@/domain/entities";
import axios from "axios";

const PREFIX = "/quotes";
const route = "http://localhost:3000" + PREFIX;

export const quoteService = {
  async getAll() {
    try {
      return await axios.get<QuoteEntity[]>(route);
    } catch (error) {
      throw error;
    }
  }
};
