import itemsReducer from './tree/items-slice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
	reducer: {
		items: itemsReducer,
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
