import { httpRequest } from "@/config";
import { RegisterClientDto } from "@/domain/dtos/client";
import { ClientEntity } from "@/domain/entities";

const PREFIX = "/client";

export const clientService = {
  getAllClients: async () => {
    try {
      return await httpRequest.get<ClientEntity[]>(`${PREFIX}`);
    } catch (error) {
      throw error;
    }
  },

  clietRegister: async (registerClientDto: RegisterClientDto) => {
    try {
      return await httpRequest.post<ClientEntity>(
        `${PREFIX}/register`,
        registerClientDto
      );
    } catch (error) {
      throw error;
    }
  },
};
