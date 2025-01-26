import { useDispatch, useSelector } from "react-redux";

import { onSetUpsertClient, onSetClients, onSetSelectedClient } from "../store";
import { ClientDto } from "@/domain/dtos/client";
import {
  useLazyGetAllClientsQuery,
  useUpsertClientMutation,
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
  const [upsertClient, { isLoading: isUpsertingClient, ...restUpsertClient }] =
    useUpsertClientMutation();

  const { startShowApiError, startShowSuccess } = useAlert();


  const startUpsertingClient = async (clientDto: ClientDto) => {
    return await upsertClient(clientDto)
      .unwrap()
      .then(({ data, message }) => {
        // if (data.id) {
        //   dispatch(onSetSelectedClient(data));
        // }
        dispatch(onSetUpsertClient(data));
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
    upsertClientResult: {
      ...restUpsertClient,
      isUpsertingClient,
    },

    //* Functions
    startGettingAllClients,
    startUpsertingClient,
    startSelectingClient,
  };
};
