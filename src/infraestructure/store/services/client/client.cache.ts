import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import type { RootState } from "@reduxjs/toolkit/query";
import type { ApiResponse } from "../response";
import type { ClientEntity } from "@/domain/entities";
import { clientService } from "./client.service";

type Service = typeof clientService.reducerPath;

export const clientCache = {
  upsertClient: function (
    data: ApiResponse<ClientEntity>,
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => RootState<any, any, Service>
  ) {
    const args = clientService.util.selectCachedArgsForQuery(
      getState(),
      "getAllClients"
    );

    args.forEach((arg) => {
      dispatch(
        clientService.util.updateQueryData("getAllClients", arg, (draft) => {
          const existClient = draft.data.findIndex(
            (client) => client.id === data.data.id
          );
          if (existClient !== -1) {
            draft.data = draft.data.map((client) =>
              client.id === data.data.id ? data.data : client
            );
          } else {
            draft.data.push(data.data);
          }
        })
      );
    });
  },
};

