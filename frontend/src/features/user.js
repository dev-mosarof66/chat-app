import { createSlice } from "@reduxjs/toolkit";
import {
    createUser,
    loginUser,
    logoutUser,
    deleteUser,
    fetchUser,
    updateProfile,
    fetchAllUser,
} from "../utils/user/user";
import { toast } from "react-hot-toast";

const initialState = {
    userData: null,
    allUser:[],
    selectedChat: null,
    loginLoading: false,
    signupLoading: false,
    updateUserLoading: false,
    deleteUserLoading: false,
    logoutUserLoading: false,
    fetchUserLoading: false,
    isLoginSuccess: false,
    isSignupSuccess: false,
    isLogoutSuccess: false,
    isUpdateUserSuccess: false,
    isDeleteUserSuccess: false,
    isFetchUserSuccess: false,
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setSelectedChat: (state, action) => {
            state.selectedChat = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createUser.pending, (state) => {
                state.error = null;
                state.signupLoading = true;
                state.isSignupSuccess = false

            })
            .addCase(createUser.fulfilled, (state, action) => {
                const { data, message } = action.payload;
                state.signupLoading = false;
                state.userData = data;
                toast.success(message);
                state.isSignupSuccess = true

            })
            .addCase(createUser.rejected, (state, action) => {
                const { data, message } = action.payload;
                state.signupLoading = false;
                state.userData = data
                state.error = action.payload;
                state.isSignupSuccess = false
                toast.error(message);
            })

            .addCase(loginUser.pending, (state) => {
                state.loginLoading = true;
                state.error = null;
                state.isLoginSuccess = false

            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const { data, message } = action.payload;
                state.loginLoading = false;
                state.isLoginSuccess = true
                state.userData = data;
                toast.success(message);
            })
            .addCase(loginUser.rejected, (state, action) => {
                const { message } = action.payload
                state.loginLoading = false;
                state.error = action.payload;
                state.isLoginSuccess = false
                toast.error(message);
            })

            .addCase(logoutUser.pending, (state) => {
                state.logoutUserLoading = true
                state.error = null
                state.isLogoutSuccess = false
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.userData = null;
                state.logoutUserLoading = false;
                state.selectedChat = null;
                state.isLogoutSuccess = true
                toast.success("Logged out successfully!");
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.logoutUserLoading = false;
                state.error = action.payload;
                state.isLogoutSuccess = false

            })

            // delete user 
            .addCase(deleteUser.pending, (state) => {
                state.deleteUserLoading = true
                state.error = null
                state.isDeleteUserSuccess = false
            })

            .addCase(deleteUser.fulfilled, (state) => {
                state.userData = null;
                state.deleteUserLoading = false
                state.selectedChat = null;
                state.isDeleteUserSuccess = true

                toast.success("User deleted successfully!");
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.deleteUserLoading = false
                toast.error(action.payload || "Failed to delete user");
                state.isDeleteUserSuccess = false

            })

            // Fetch User
            .addCase(fetchUser.pending, (state) => {
                state.fetchUserLoading = true;
                state.error = null;
                state.isFetchUserSuccess = false
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.userData = action.payload.data;
                state.isFetchUserSuccess = true
                state.fetchUserLoading = false;
            })
            .addCase(fetchUser.rejected, (state) => {
                state.fetchUserLoading = false;
                state.isFetchUserSuccess = false

            })
            //update profile
            .addCase(updateProfile.pending, (state) => {
                state.updateUserLoading = true;
                state.error = null;
                state.isUpdateUserSuccess = false
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.userData = action.payload.data;
                state.updateUserLoading = false
                state.isUpdateUserSuccess = false;
                toast.success("Profile updated successfully!");
            })
            .addCase(updateProfile.rejected, (state) => {
                state.isUpdateUserSuccess = false;
                state.updateUserLoading = false

            })

            //fetch all user from database
            .addCase(fetchAllUser.pending, (state) => {
                state.fetchUserLoading = true;
                state.error = null;
                state.isFetchUserSuccess = false
            })
            .addCase(fetchAllUser.fulfilled, (state, action) => {
                state.allUser = action.payload.data;
                state.fetchUserLoading = false
                state.isFetchUserSuccess = false;
            })
            .addCase(fetchAllUser.rejected, (state) => {
                state.isFetchUserSuccess = false;
                state.fetchUserLoading = false

            })
    },
});

export const { setSelectedChat } = userSlice.actions;
export default userSlice.reducer;
