import { httpRequest } from "@/config";
import { ClientEntity } from "@/domain/entities";
import { NewClientDto } from "@/domain/dtos/client";



const PREFIX = "/client";

export const clientService = {
    
    getAllClients: async () => {
        try {
            return await httpRequest.get<ClientEntity[]>(`${PREFIX}`);
        } catch (error) {
            throw error;
        }
    },

    clietRegister: async (clientDto:NewClientDto) => {
           try {
                return await httpRequest.post<ClientEntity>(`${PREFIX}/register`, clientDto);
           }catch(error){
               throw error;
           }
            
    }

}
