import { useDispatch, useSelector } from "react-redux";

import { onSetNewClient, onSetClients, onSetSelectedClient } from "../store";
import { ClientDto } from "@/domain/dtos/client";
import {
  useCreateClientMutation,
  useLazyGetAllClientsQuery,
  useUpdateClientMutation,
} from "../store/services";
import { useAlert } from "@/presentation/hooks";
import type { AppState } from "@/app/store";
import { ClientEntity } from "../../domain/entities/client.entity";

export const useClientStore = () => {
  const dispatch = useDispatch();
  const client = useSelector((state: AppState) => state.client);

  const [
    getAllClients,
    { isLoading: isGettingAllClients, ...restGetAllClients },
  ] = useLazyGetAllClientsQuery();
  useLazyGetAllClientsQuery();
  const [createClient, { isLoading: isCreatingClient, ...restCreateClient }] =
    useCreateClientMutation();
  const [updateClient, { isLoading: isUpdatingClient, ...restUpdateClient }] =
    useUpdateClientMutation();

  const { startShowApiError, startShowSuccess } = useAlert();

  const startCreatingClient = async (clientDto: ClientDto) => {
    await createClient(clientDto)
      .unwrap()
      .then(({ data, message }) => {
        dispatch(onSetNewClient(data));
        startShowSuccess(message);
      })
      .catch((error) => {
        startShowApiError(error);
        throw error;
      });
  };

  const startUpdatingClient = async (id: number, clientDto: ClientDto) => {
    return await updateClient({ id, ...clientDto })
      .unwrap()
      .then(({ data, message }) => {
        dispatch(onSetNewClient(data));
        startShowSuccess(message);
        return data;
      })
      .catch((error) => {
        startShowApiError(error);
        throw error;
      });
  };

  const startGettingAllClients = async () => {
    await getAllClients()
      .unwrap()
      .then(({ data }) => {
        dispatch(onSetClients(data));
      })
      .catch((error) => {
        startShowApiError(error);
        throw error;
      });
  };

  const startSelectingClient = async (client: ClientEntity | null) => {
    dispatch(onSetSelectedClient(client));
  };

  return {
    //* Atributtes
    ...client,
    getAllClientsResult: {
      ...restGetAllClients,
      isGettingAllClients,
    },
    createClientResult: {
      ...restCreateClient,
      isCreatingClient,
    },
    updateClientResult: {
      ...restUpdateClient,
      isUpdatingClient,
    },

    //* Functions
    startGettingAllClients,
    startCreatingClient,
    startUpdatingClient,
    startSelectingClient,
  };
};
