/* eslint-disable array-callback-return */
import { createSlice } from "@reduxjs/toolkit";
import { produce } from "immer";

const initialState = {
	cartItems: [],
};
export const themeReducer = createSlice({
	name: "Reudcer",
	initialState,
	reducers: {
		addProductToCart(state, action) {
			return produce(state, (DRAFT_STATE) => {
				DRAFT_STATE.cartItems.push(action.payload);
			});
		},
		updateCartPlus(state, action) {
			state.cartItems.map((item) => {
				if (item.id === action.payload.id) {
					item.quantity++;
				}
			});
		},
		updateCartMinus(state, action) {
			state.cartItems.map((item) => {
				if (item.id === action.payload.id) {
					if (item.quantity > 0) item.quantity--;
					if (item.quantity === 0) {
						const cartItems = state.cartItems.filter(
							(product) => item.id !== product.id,
						);
						state.cartItems = cartItems;
					}
				}
			});
		},
	},
});
export const {
	addProductToCart,
	removeProductFormCart,
	updateCartPlus,
	updateCartMinus,
	addPrices,
	clearCart,
} = themeReducer.actions;
