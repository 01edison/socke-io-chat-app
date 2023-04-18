import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { user: {}, currentChat: {}, chats: [] },
  reducers: {
    setUser(state, action) {
      const userInfo = action.payload;
      state.user = userInfo;
    },

    setCurrentChat(state, action) {
      const chat = action.payload;
      state.currentChat = chat;
    },

    setChats(state, action) {
      const chats = action.payload;
      state.chats = chats;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice;
