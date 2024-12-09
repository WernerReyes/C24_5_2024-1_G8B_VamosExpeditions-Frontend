import { ClientEntity } from "@/domain/entities";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export type ClientSliceState = {
    clients: ClientEntity[];
    selectedClient: ClientEntity | null;
  };
  
  const initialState: ClientSliceState = {
    clients: [],
    selectedClient: null
  }

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
    
    onAddNewClient: (state, { payload }: PayloadAction<ClientEntity>) => {
        return {
        ...state,
        clients: [...state.clients, payload],
        };
    },

    },
  });

export const { onSetClients,onAddNewClient } = clientSlice.actions;