import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [], // 购物车商品列表
    total: 0, // 购物车商品总价格
    // 屏幕右侧Modal的显示状态
    isModalVisible: false,
    discountCode: "", // 折扣码
    discountAmount: 0, // 折扣金额
    discountPercentage: 0, // 折扣百分比
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        // 添加商品到购物车
        addItem: (state, action) => {
            const { product, cartQuantity = 1 } = action.payload;
            const existingItem = state.items.find(
                (item) => item.id === product.id || item._id === product._id
            );
            console.log(product);
            console.log(existingItem);
            if (existingItem) {
                // 如果商品已存在，增加数量
                existingItem.cartQuantity += cartQuantity;
            } else {
                // 如果商品不存在，添加新商品
                state.items.push({
                    ...product,
                    cartQuantity,
                });
            }
            state.total = state.items.reduce((total, item) => total + (item.discountedPrice || item.regularPrice) * item.cartQuantity, 0);
        },

        // 从购物车移除商品
        removeItem: (state, action) => {
            const itemId = action.payload;
            state.items = state.items.filter(
                (item) => item.id !== itemId && item._id !== itemId
            );
            state.total = state.items.reduce((total, item) => total + (item.discountedPrice || item.regularPrice) * item.cartQuantity, 0);
        },

        // 更新商品数量
        updateQuantity: (state, action) => {
            const { itemId, cartQuantity } = action.payload;
            const item = state.items.find(
                (item) => item.id === itemId || item._id === itemId
            );

            if (item) {
                if (item.cartQuantity <= 0) {
                    // 如果数量为0或负数，移除商品
                    state.items = state.items.filter(
                        (item) => item.id !== itemId && item._id !== itemId
                    );
                } else {
                    item.cartQuantity = cartQuantity;
                }
                state.total = state.items.reduce((total, item) => total + (item.discountedPrice || item.regularPrice) * item.cartQuantity, 0);
            }
        },

        // 清空购物车
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
        },

        // 设置购物车（用于从服务器加载购物车数据）
        setCart: (state, action) => {
            state.items = action.payload.items || [];
            state.total = action.payload.total || 0;
        },

        // 显示购物车 Drawer
        showCartDrawer: (state) => {
            state.isModalVisible = true;
        },

        // 隐藏购物车 Drawer
        hideCartDrawer: (state) => {
            state.isModalVisible = false;
        },

        // 设置折扣码
        setDiscountCode: (state, action) => {
            state.discountCode = action.payload;
        },

        // 应用折扣（设置折扣金额和百分比）
        applyDiscount: (state, action) => {
            const { discountAmount, discountPercentage } = action.payload;
            state.discountAmount = discountAmount || 0;
            state.discountPercentage = discountPercentage || 0;
        },

        // 清除折扣
        clearDiscount: (state) => {
            state.discountCode = "";
            state.discountAmount = 0;
            state.discountPercentage = 0;
        },
    },
});

export const { addItem, removeItem, updateQuantity, clearCart, setCart, showCartDrawer, hideCartDrawer, setDiscountCode, applyDiscount, clearDiscount } = cartSlice.actions;
export default cartSlice.reducer;

