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

export const { onSetClients, onSetSelectedClient } =
  clientSlice.actions;
