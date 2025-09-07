import { createSlice } from "@reduxjs/toolkit";
import { createNewChat, deleteChat, deleteMessage, fetchChatHistory, sendMessage } from "../utils/chat/chat";

const initialState = {
    chats: [],
    data: null,
    chatId: null,
    loading: false,
    error: null,
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setCurrentChat: (state, action) => {
            state.currentChat = action.payload;
        },
        clearCurrentChat: (state) => {
            state.currentChat = null;
        },
    },
    extraReducers: (builder) => {
        // Create New Chat
        builder
            .addCase(fetchChatHistory.pending, (state) => {
                state.error = null;
                state.data = null;
                state.chats = null
                state.loading = true;
            })
            .addCase(fetchChatHistory.fulfilled, (state, action) => {
                const { user, messages, chatId } = action.payload
                state.data = user
                state.chats = messages
                state.chatId = chatId
                state.loading = false;
                state.data = user;
            })
            .addCase(fetchChatHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //create new chat
            .addCase(createNewChat.pending, (state) => {
                state.error = null;
                state.data = null;
                state.chats = null
                state.loading = true;
            })
            .addCase(createNewChat.fulfilled, (state, action) => {
                const { user, chats } = action.payload
                state.loading = false;
                state.data = user;
                state.chats = chats
            })
            .addCase(createNewChat.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //send message
            .addCase(sendMessage.pending, (state) => {
                state.error = null;
                state.data = null;
                state.chats = null
                state.loading = true;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                console.log(action.payload)
                const { user, messages, chatId } = action.payload
                state.loading = false;
                state.data = user
                state.chatId = chatId
                state.chats = messages
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //delete chat
            .addCase(deleteChat.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteChat.fulfilled, (state, action) => {
                state.loading = false;
                state.chats = state.chats.filter(chat => chat._id !== action.payload.chatId);
                if (state.currentChat?._id === action.payload.chatId) {
                    state.currentChat = null;
                }
            })
            .addCase(deleteChat.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMessage.fulfilled, (state, action) => {
                state.loading = false;
                const { chatId, messageId } = action.payload;
                const chat = state.chats.find(c => c._id === chatId) || state.currentChat;
                if (chat) {
                    chat.messages = chat.messages.filter(msg => msg._id !== messageId);
                }
            })
            .addCase(deleteMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setCurrentChat, clearCurrentChat } = chatSlice.actions;
export default chatSlice.reducer;
