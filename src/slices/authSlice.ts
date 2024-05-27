// slices/authSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";
import { AxiosError } from "axios";

type LoginUser = {
    email: string;
    password: string;
};

type NewUser = {
    email: string;
    password: string;
    name: string;
};

type UserBasicInfo = {
    id: string;
    email: string;
    password: string;
    name: string;
    isAdmin: boolean;
};

type UserProfileData = {
    id: string;
    name: string;
    email: string;
};

type ErrorResponse = {
    message: string;
};

type AuthApiState = {
    basicUserInfo?: UserBasicInfo | null;
    userProfileData?: UserProfileData | null;
    status: "idle" | "loading" | "failed";
    error: string | null;
};

const initialState: AuthApiState = {
    basicUserInfo: localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo") as string)
        : null,
    userProfileData: undefined,
    status: "idle",
    error: null,
};

export const login = createAsyncThunk(
    "login",
    async (data: LoginUser, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/users/login", data);
            const resData = response.data;
            localStorage.setItem("userInfo", JSON.stringify(resData));
            return resData;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const errorResponse = error.response.data;
                return rejectWithValue(errorResponse);
            }
            throw error;
        }
    }
);

export const register = createAsyncThunk(
    "register",
    async (data: NewUser, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/users/register", data);
            const resData = response.data;
            localStorage.setItem("userInfo", JSON.stringify(resData));
            return resData;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const errorResponse = error.response.data;
                return rejectWithValue(errorResponse);
            }
            throw error;
        }
    }
);

export const logout = createAsyncThunk(
    "logout",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/users/logout", {});
            const resData = response.data;
            localStorage.removeItem("userInfo");
            return resData;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const errorResponse = error.response.data;
                return rejectWithValue(errorResponse);
            }
            throw error;
        }
    }
);

export const getUser = createAsyncThunk(
    "users/profile",
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/users/getById/${userId}`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const errorResponse = error.response.data;
                return rejectWithValue(errorResponse);
            }
            throw error;
        }
    }
);

export const updateUser = createAsyncThunk(
    "users/update",
    async ({ userId, userData }: { userId: string, userData: NewUser }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/users/update/${userId}`, userData);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const errorResponse = error.response.data;
                return rejectWithValue(errorResponse);
            }
            throw error;
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<UserBasicInfo>) => {
                state.status = "idle";
                state.basicUserInfo = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = "failed";
                if (action.payload) {
                    state.error = (action.payload as ErrorResponse).message || "Login failed";
                } else {
                    state.error = action.error.message || "Login failed";
                }
            })
            .addCase(register.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action: PayloadAction<UserBasicInfo>) => {
                state.status = "idle";
                state.basicUserInfo = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.status = "failed";
                if (action.payload) {
                    state.error = (action.payload as ErrorResponse).message || "Registration failed";
                } else {
                    state.error = action.error.message || "Registration failed";
                }
            })
            .addCase(logout.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.status = "idle";
                state.basicUserInfo = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.status = "failed";
                if (action.payload) {
                    state.error = (action.payload as ErrorResponse).message || "Logout failed";
                } else {
                    state.error = action.error.message || "Logout failed";
                }
            })
            .addCase(getUser.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.status = "idle";
                state.userProfileData = action.payload;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.status = "failed";
                if (action.payload) {
                    state.error = (action.payload as ErrorResponse).message || "Get user profile data failed";
                } else {
                    state.error = action.error.message || "Get user profile data failed";
                }
            })
            .addCase(updateUser.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.status = "idle";
                state.userProfileData = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.status = "failed";
                if (action.payload) {
                    state.error = (action.payload as ErrorResponse).message || "Update profile failed";
                } else {
                    state.error = action.error.message || "Update profile failed";
                }
            });
    },
});

export default authSlice.reducer;
