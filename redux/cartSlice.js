import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: 'cartSlice',
    initialState: { cart: [] },
    reducers: {
        addToMyCart: (state, action) => {
            const itemPresent = state.cart.find(
                (item) => item.id === action.payload.id
            );

            if (itemPresent) {
                itemPresent.quantity++;
            } else {
                state.cart.push({ ...action.payload, quantity: 1 });
            }
        },
        removeFromMyCart: (state, action) => {
            state.cart = state.cart.filter(
                (item) => item.id !== action.payload.id
            );
        },
        incrementMyQuantity: (state, action) => {
            const itemPresent = state.cart.find(
                (item) => item.id === action.payload.id
            );
            if (itemPresent) {
                itemPresent.quantity++;
            }
        },
        decrementMyQuantity: (state, action) => {
            const itemPresent = state.cart.find(
                (item) => item.id === action.payload.id
            );
            if (itemPresent) {
                if (itemPresent.quantity === 1) {
                    state.cart = state.cart.filter(
                        (item) => item.id !== action.payload.id
                    );
                } else {
                    itemPresent.quantity--;
                }
            }
        },
        cleanMyCart: (state) => {
            state.cart = [];
        }
    }
});

export const { addToMyCart, removeFromMyCart, incrementMyQuantity, decrementMyQuantity, cleanMyCart } = cartSlice.actions;
export default cartSlice.reducer;