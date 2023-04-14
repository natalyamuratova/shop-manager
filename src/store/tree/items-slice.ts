import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Item from '../../models/item';

export interface ItemsState {
    value: Item[],
}

const initialState: ItemsState = {
	value: [],
};

export const itemsSlice = createSlice({
	name: 'items',
	initialState,
	reducers: {
		setItems: (state: ItemsState, action: PayloadAction<Item[]>) => {
			state.value = action.payload;
		}
	}
});

export const { setItems } = itemsSlice.actions;

export default itemsSlice.reducer;
