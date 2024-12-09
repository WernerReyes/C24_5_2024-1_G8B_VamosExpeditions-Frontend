import { useDispatch, useSelector } from "react-redux";
import { clientService } from "../services/client";

import { onAddNewClient, onSetClients, type AppState } from "../store";
import { toasterAdapter } from "@/presentation/components";


export const useClientStore = () => {
    const dispatch = useDispatch();
    const client = useSelector((state: AppState) => state.client);

    const startGetClients = async () => {
        try {
            const { data } = await clientService.getAllClients();
            dispatch(onSetClients(data));
        } catch (error: any) {
            throw error;
        }
    }

    const startRegisterClient = async (fullName: string, email: string, phone: string, country: string) => {
        try {


            const { data, message } = await clientService.clietRegister({ fullName, email, phone, country });

            dispatch(onAddNewClient(data));
            toasterAdapter.success(message);
        } catch (error: any) {
            toasterAdapter.error(error.error);
            throw error;
        }
    }



    return {
        //* Atributtes
        ...client,

        //* Functions
        startGetClients,
        startRegisterClient
    };
};