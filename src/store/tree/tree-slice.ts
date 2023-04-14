import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import TreeData from '../../models/tree-data';
import dataJson from '../../data.json';
import buildTreeData from '../../utils/build-tree-data';

export interface TreeState {
    value: TreeData,
}

const initialState: TreeState = {
	value: {
		id: crypto.randomUUID(),
		name: 'Товары',
		children: [],
	},
};

export const treeSlice = createSlice({
	name: 'tree',
	initialState,
	reducers: {
		buildTree: (state: TreeState) => {
			state.value = buildTreeData(dataJson);
		},
		setTree: (state: TreeState, action: PayloadAction<TreeData>) => {
			state.value = action.payload;
		}
	}
});

export const { buildTree, setTree } = treeSlice.actions;

export default treeSlice.reducer;
