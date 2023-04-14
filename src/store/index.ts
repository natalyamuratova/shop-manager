import treeReducer from './tree/tree-slice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
	reducer: {
		tree: treeReducer,
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
