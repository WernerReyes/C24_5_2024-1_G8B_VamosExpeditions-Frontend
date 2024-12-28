import { toasterAdapter } from "@/presentation/components";
import { reservationService } from "../services/reservation"




export const useReservationStore = () => {


    const registerReservation = async (

        clientId: number,
        numberOfPeople: string,
        travelDates: Date[],
        code: string,
        comfortClass: string,
        destination: { [key: number]: boolean},
        specialSpecifications: string,

    ) => {

        try {
         const {data,message} =await reservationService.registerReservation({
                clientId,
                numberOfPeople,
                travelDates,
                code,
                comfortClass,
                destination,
                specialSpecifications
                
            });
            toasterAdapter.success(message);
            
           console.log(data);
        } catch (error) {
            throw error;
        }
    }



    return {
        registerReservation
    }
}