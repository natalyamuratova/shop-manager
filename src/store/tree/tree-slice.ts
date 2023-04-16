import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import TreeData from '../../models/tree-data';
import dataJson from '../../data.json';
import { convertArrayToTree, convertTreeToArray } from '../../utils/tree-converters';
import ItemType from '../../models/item-type';
import { saveFile } from '../../utils/file-utils';
import Item from '../../models/item';
import { findNode, getChildNodeType } from '../../utils/data-utils';

export interface TreeState {
    value: TreeData,
}

const initialState: TreeState = {
	value: {
		id: crypto.randomUUID(),
		name: 'Товары',
		type: ItemType.ROOT,
		children: [],
	},
};

export const treeSlice = createSlice({
	name: 'tree',
	initialState,
	reducers: {
		buildTree: (state: TreeState) => {
			state.value = convertArrayToTree(dataJson);
		},
		setTree: (state: TreeState, action: PayloadAction<TreeData>) => {
			state.value = action.payload;
		},
		saveTree: (state: TreeState) => {
			const data = convertTreeToArray(state.value)
				.filter((node) => (node.meaningful === 'true'));
			saveFile({
				data,
				fileName: 'data.json',
				contentType: 'application/json',
			});
		},
		addLink: (state: TreeState, action: PayloadAction<{ parentNode: TreeData, newItem: Partial<Item> }>) => {
			const { newItem, parentNode } = action.payload;
			if (!newItem.name) {
				return;
			}
			const parentNodeFromTree = findNode(state.value, parentNode.id ?? '');
			const newNode: TreeData = {
				id: crypto.randomUUID(),
				meaningful: !!newItem.meaningful,
				name: newItem.name,
				type: getChildNodeType(parentNode.type),
				children: [],
			};
			parentNodeFromTree?.children.push(newNode);
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

export const { buildTree, setTree, addLink, deleteLink, saveTree } = treeSlice.actions;

export default treeSlice.reducer;
