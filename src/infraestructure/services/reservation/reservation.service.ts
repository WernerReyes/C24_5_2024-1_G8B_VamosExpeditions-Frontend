import { httpRequest } from "@/config";
import { ReservationDto } from "@/domain/dtos/reservation";

const PREFIX = '/reservation';

export const reservationService =  {

    registerReservation: async (reservation: ReservationDto)=>{
        try {
            return await httpRequest.post(`${PREFIX}/register`, reservation);
        } catch (error) {
            throw error;
        }
    },



    
    

}