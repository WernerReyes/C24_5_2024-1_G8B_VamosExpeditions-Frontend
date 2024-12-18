import { httpRequest } from "@/config";
import type { ExternalCountryEntity } from "./country.entity";

const PREFIX = "/external/country";

export const externalCountryService = {
  getAll: async () => {
    try {
      return await httpRequest.get<ExternalCountryEntity[]>(`${PREFIX}`);
    } catch (error) {
      throw error;
    }
  },
};
