import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import TreeData from '../../models/tree-data';
import dataJson from '../../data.json';
import { convertArrayToTree, convertTreeToArray } from '../../utils/tree-converters';
import ItemType, { ItemTypeNames } from '../../models/item-type';
import { saveFile } from '../../utils/file-utils';
import { TreeDataHistory } from '../../models/tree-data-history';

export interface TreeState {
	history: TreeDataHistory[],
    currentValue: TreeDataHistory,
}

const historyItem: TreeDataHistory = {
	time: new Date(),
	data: {
		id: crypto.randomUUID(),
		name: ItemTypeNames[ItemType.ROOT],
		type: ItemType.ROOT,
		children: [],
	},
};

const initialState: TreeState = {
	currentValue: historyItem,
	history: [historyItem],
};

export const treeSlice = createSlice({
	name: 'tree',
	initialState,
	reducers: {
		buildTree: (state: TreeState) => {
			state.currentValue = {
				data: convertArrayToTree(dataJson),
				time: new Date(),
			};
			state.history = [state.currentValue];
		},
		setTree: (state: TreeState, action: PayloadAction<TreeDataHistory>) => {
			state.currentValue = action.payload;
		},
		saveTreeToFile: (state: TreeState) => {
			const data = convertTreeToArray(state.currentValue.data).filter((node) => (node.meaningful === 'true'));
			saveFile({ data, fileName: 'data.json', contentType: 'application/json' });
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

			filterChild(state.currentValue.data);

			state.currentValue = {
				data: state.currentValue.data,
				time: new Date(),
			};
			state.history.push(state.currentValue);
		}
	},
});

export const {
	buildTree,
	setTree,
	deleteLink,
	saveTreeToFile,
} = treeSlice.actions;

export default treeSlice.reducer;
