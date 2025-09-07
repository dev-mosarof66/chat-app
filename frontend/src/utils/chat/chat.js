import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axios";

export const fetchChatHistory = createAsyncThunk(
    "chat/fetchChatHistory",
    async (friend_id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/chats/${friend_id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch chat history");
        }
    }
);

export const createNewChat = createAsyncThunk(
    "chat/createNewChat",
    async (friendId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/chats/create-chat/${friendId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create chat");
        }
    }
);

// Delete a chat by chat ID
export const deleteChat = createAsyncThunk(
    "chat/deleteChat",
    async (chatId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/api/chats/${chatId}`);
            return { chatId, message: response.data.message };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete chat");
        }
    }
);

// Delete a specific message from a chat
export const deleteMessage = createAsyncThunk(
    "chat/deleteMessage",
    async ({ chatId, messageId }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/api/chats/${chatId}/messages/${messageId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete message");
        }
    }
);

export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async ({ msg, receiverId }, { rejectWithValue }) => {
        
        try {
            const res = await axiosInstance.post(`/chats/send-message`, {
                message: msg, to: receiverId
            })
            console.log(res.data)
            return res.data.data
        } catch (error) {
            return rejectWithValue(error.response.message || 'Something went wrong')
        }
    }
)
