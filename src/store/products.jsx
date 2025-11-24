import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { req } from "../utils/request";

// Async action: Get all products
export const getAllProductAsync = createAsyncThunk(
    "products/getAllProduct",
    async (_, { rejectWithValue }) => {
        try {
            const response = await req("/products", "GET");
            return response;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to get products");
        }
    }
);

const initialState = {
    products: {
        data:[],
        total: 0,
        page: 1,
        size: 10,
        loading: false, // 加载状态
        error: null, // 错误信息
    }, 

};

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        // Clear error message
        clearError: (state) => {
            state.products.error = null;
        },
    },
    extraReducers: (builder) => {
        // Get all products
        builder
            .addCase(getAllProductAsync.pending, (state) => {
                state.products.loading = true;
                state.products.error = null;
            })
            .addCase(getAllProductAsync.fulfilled, (state, action) => {
                const {data, pagination} = action.payload
                state.products.loading = false;
                state.products.data = data || [];
                state.products.total = pagination.total || 0;
                state.products.page = pagination.page || 1;
                state.products.size = pagination.size || 10;
                state.products.error = null;
            })
            .addCase(getAllProductAsync.rejected, (state, action) => {
                state.products.loading = false;
                state.products.error = action.payload || "Failed to get products";
            });
    },
});

export const { clearError } = productsSlice.actions;
export default productsSlice.reducer;

