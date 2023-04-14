import React from 'react';
import Tree from 'react-d3-tree';
import './app-tree.css';
import { TreeNodeEventCallback } from 'react-d3-tree/lib/types/Tree/types';

export interface TreeData {
    id?: string;
    name: string;
    children: TreeData[];
}

interface AppTreeProps {
    data: TreeData;
    onNodeClick: TreeNodeEventCallback;
}

export const AppTree = (props: AppTreeProps) => {
	const { data, onNodeClick } = props;
	return (
		<div id="treeWrapper" style={{ width: '100em', height: '100em' }}>
			<Tree
				data={data}
				onNodeClick={onNodeClick}
				rootNodeClassName="node__root"
				branchNodeClassName="node__branch"
				leafNodeClassName="node__leaf"
			/>
		</div>
	);
};
