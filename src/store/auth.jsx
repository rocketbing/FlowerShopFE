import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { req } from "../utils/request";



// Async action: Login
export const loginAsync = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            // The interceptor in request.js already returns data, so no need to access .data
            const response = await req("/auth/login", "POST", credentials);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || "Login failed");
        }
    }
);
// google login
export const googleLoginAsync = createAsyncThunk(
    "auth/googleLogin",
    async (credentials, { rejectWithValue }) => {
        try {
            // credentials should contain: { idToken: "google_id_token" }
            // This will be sent as POST body to /auth/google endpoint
            const response = await req("/auth/google", "POST", credentials);
            return response;
        }
        catch (error) {
            return rejectWithValue(error.message || "Google login failed");
        }
    }
);
// Async action: Register
export const registerAsync = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            // The interceptor in request.js already returns data, so no need to access .data
            const response = await req("/auth/register", "POST", userData);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || "Registration failed");
        }
    }
);

// Async action: Resend verification email
export const resendVerificationEmailAsync = createAsyncThunk(
    "auth/resendVerificationEmail",
    async (email, { rejectWithValue }) => {
        try {
            // The interceptor in request.js already returns data, so no need to access .data
            const response = await req("/auth/resend-verification", "POST", { email });
            return response || { message: "Verification email sent" };
        } catch (error) {
            return rejectWithValue(error.message || "Failed to send email");
        }
    }
);

// Async action: Logout
export const logoutAsync = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            // TODO: Replace with actual logout API endpoint
            // await req("/api/auth/logout", "POST");

            // Clear local storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            return true;
        } catch (error) {
            return rejectWithValue(error.message || "Logout failed");
        }
    }
);
// get userinfo
export const getUserInfoAsync = createAsyncThunk(
    "auth/getUserInfo",
    async (_, { rejectWithValue }) => {
        try {
            const response = await req("/userinfo", "GET");
            return response;
        }
        catch (error) {
            return rejectWithValue(error.message || "Failed to get user info");
        }
    }
);
// update userinfo
export const updateUserInfoAsync = createAsyncThunk(
    "auth/updateUserInfo",
    async (userInfo, { rejectWithValue }) => {
        try {
            const response = await req("/userinfo", "PUT", userInfo);
            return response;
        }
    catch (error) {
        return rejectWithValue(error.message || "Failed to update user info");
    }
});
// Edit Shipping address
export const editAddressAsync = createAsyncThunk(
    "auth/editAddress",
    async ({ id, address }, { rejectWithValue }) => {
        try {
            const response = await req(`/userinfo/shipping-address/${id}`, "PUT", address);
            return response;
        } catch (error) {
        return rejectWithValue(error.message || "Failed to edit address");
    }
});
// Delete Shipping address
export const deleteAddressAsync = createAsyncThunk(
    "auth/deleteAddress",
    async (id, { rejectWithValue }) => {
        try {
            const response = await req(`/userinfo/shipping-address/${id}`, "DELETE");
            return response;
        }
        catch (error) {
            return rejectWithValue(error.message || "Failed to delete address");
        }
});
// Initialize state: Restore login state from localStorage
const getInitialState = () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    let user = null;

    try {
        user = userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        console.error("Failed to parse user from localStorage", e);
    }

    return {
        token: token || null,
        user: user,
        isAuthenticated: !!token,
        loading: false,
        error: null,
    };
};

const authSlice = createSlice({
    name: "auth",
    initialState: getInitialState(),
    reducers: {
        // Clear error message
        clearError: (state) => {
            state.error = null;
        },
        // Update user information
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            localStorage.setItem("user", JSON.stringify(state.user));
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;

                // Save to localStorage
                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("user", JSON.stringify(action.payload.user));
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Login failed";
                state.isAuthenticated = false;
            });

        // Google login
        builder
            .addCase(googleLoginAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(googleLoginAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;

                // Save to localStorage
                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("user", JSON.stringify(action.payload.user));
            })
            .addCase(googleLoginAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Google login failed";
                state.isAuthenticated = false;
            });

        // Register
        builder
            .addCase(registerAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerAsync.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
                // After successful registration, user needs to manually log in
            })
            .addCase(registerAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Registration failed";
            });

        // Resend verification email
        builder
            .addCase(resendVerificationEmailAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resendVerificationEmailAsync.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(resendVerificationEmailAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to send email";
            });

        // Logout
        builder
            .addCase(logoutAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutAsync.fulfilled, (state) => {
                state.loading = false;
                state.token = null;
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Logout failed";
            });
        // get userinfo
        builder
            .addCase(getUserInfoAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserInfoAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(getUserInfoAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to get user info";
            });
        // update userinfo
        builder
            .addCase(updateUserInfoAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserInfoAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(updateUserInfoAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update user info";
            });
    },
});

export const { clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;

