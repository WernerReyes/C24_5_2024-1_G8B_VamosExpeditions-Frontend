import { NotificationMessageEntity } from "@/domain/entities";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MessagesState {
    messages: NotificationMessageEntity[] | null;
  }
  
  const initialState: MessagesState = {
    messages: [],
  };
  
  export const userNotificationSlice = createSlice({
    name: "chatNotifications",
    initialState,
    reducers: {
      setMessages: (state, action: PayloadAction<NotificationMessageEntity[]>) => {
        state.messages = action.payload;
      },
    },
  });
  
    export const { setMessages } = userNotificationSlice.actions;