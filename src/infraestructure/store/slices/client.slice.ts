import { ClientEntity } from "@/domain/entities";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ClientSliceState = {
  clients: ClientEntity[];
  selectedClient: ClientEntity | null;
};

const initialState: ClientSliceState = {
  clients: [],
  selectedClient: null,
};

export const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    onSetClients: (state, { payload }: PayloadAction<ClientEntity[]>) => {
      return {
        ...state,
        clients: payload,
      };
    },

    onSetUpsertClient: (state, { payload }: PayloadAction<ClientEntity>) => {
      return {
        ...state,
        clients: state.clients.map((client) =>
          client.id === payload.id ? payload : client
        ),
      };
    },

    onSetSelectedClient: (
      state,
      { payload }: PayloadAction<ClientEntity | null>
    ) => {
      return {
        ...state,
        selectedClient: payload,
      };
    },
  },
});

export const { onSetClients, onSetUpsertClient, onSetSelectedClient } =
  clientSlice.actions;
