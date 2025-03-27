import { constantStorage } from "@/core/constants";
import { createSlice } from "@reduxjs/toolkit";

interface SidebarState {
  isOpen: boolean;
}

const initialState: SidebarState = {
  isOpen: JSON.parse(
    localStorage.getItem(constantStorage.SIDEBAR_VISIBLE) || "true"
  ),
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    onToggleSidebar(state) {
      state.isOpen = !state.isOpen;
      localStorage.setItem(constantStorage.SIDEBAR_VISIBLE, JSON.stringify(state.isOpen));
    },

    onSetSidebar(state, action) {
      state.isOpen = action.payload;
      localStorage
        .setItem(constantStorage.SIDEBAR_VISIBLE, JSON.stringify(action.payload));
    },
   
  },
});

export const { onToggleSidebar, onSetSidebar } =
  sidebarSlice.actions;


