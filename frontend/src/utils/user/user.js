import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axios";


export const createUser = createAsyncThunk(
    "user/signup",
    async (userData, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/user/register", userData);
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);


export const loginUser = createAsyncThunk(
    "user/login",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/user/login", { email, password });
            console.log(res.data)
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);


export const logoutUser = createAsyncThunk(
    "user/logout",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/user/logout");
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);


export const deleteUser = createAsyncThunk(
    "user/delete",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.delete(`/user/delete`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);


export const fetchUser = createAsyncThunk(
    "user/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/user/me");
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const updateProfile = createAsyncThunk(
    "user/updateProfile",
    async ({ password, avatar }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            if (avatar) formData.append("avatar", avatar);
            if(password) formData.append('password',password)

            const res = await axiosInstance.put("/user/update", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Updated profile:", res.data);
            return res.data; // updated user data
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchAllUser = createAsyncThunk(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/all-user"); 
      return response.data;
    } catch (error) {
      // return error message for rejected action
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);