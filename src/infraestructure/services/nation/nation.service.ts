import { httpRequest } from "@/config";
import { CountryEntity } from "@/domain/entities";


export const nationService = {
   
    

    getAllNations: async () => {
        const  PREFIX = "/nation";
        try {
            return await httpRequest.get<CountryEntity[]>(`${PREFIX}`);
        } catch (error) {
            throw error;
        }
    },
}