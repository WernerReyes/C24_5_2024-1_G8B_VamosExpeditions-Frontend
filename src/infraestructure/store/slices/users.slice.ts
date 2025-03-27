import { UserEntity } from "@/domain/entities";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UsersState = {
  users: UserEntity[];
};

const initialState: UsersState = {
  users: [],
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, { payload }: PayloadAction<UserEntity[]>) => {
      state.users = payload; 
    },
  },
});

export const { setUsers } = usersSlice.actions;