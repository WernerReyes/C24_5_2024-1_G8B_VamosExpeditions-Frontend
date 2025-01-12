import { httpRequest } from "@/config";
import { ClientDto } from "@/domain/dtos/client";
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

  clietRegister: async (ClientDto: ClientDto) => {
    try {
      return await httpRequest.post<ClientEntity>(
        `${PREFIX}/register`,
        ClientDto
      );
    } catch (error) {
      throw error;
    }
  },
};
