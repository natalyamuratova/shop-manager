import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import TreeData from '../../models/tree-data';
import dataJson from '../../data.json';
import { convertArrayToTree } from '../../utils/tree-converters';

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
			state.value = convertArrayToTree(dataJson.items);
		},
		setTree: (state: TreeState, action: PayloadAction<TreeData>) => {
			state.value = action.payload;
		},
		deleteLink: (state: TreeState, action: PayloadAction<{ source: TreeData | null, target: TreeData }>) => {
			const { source, target } = action.payload;
			if (!source) {
				return;
			}

			const filterChild = (node: TreeData) => {
				if (node.children) {
					node.children.forEach(child => filterChild(child));
				}
				if (node.id === source.id) {
					node.children = node.children.filter(child => child.id !== target.id);
				}
			};

			filterChild(state.value);
		}
	},
});

export const { buildTree, setTree, deleteLink } = treeSlice.actions;

export default treeSlice.reducer;
