import React, { useState } from 'react';
import './goods-tree.css';
import dataJson from '../../data.json';
import { AppTree, TreeData } from '../../components/app-tree/AppTree';
import { AppTreeD3 } from '../../components/app-tree-d3/AppTreeD3';
import { HierarchyCircularNode } from 'd3';

interface Good {
    id: string;
    name: string;
    group: string;
    cluster: string;
}

const buildTreeData: (data: Good[]) => TreeData = (data: Good[]) => {
	const tree: TreeData = { name: '', children: [] };

	for (const el of data) {
		let cluster = tree.children.find((cl) => cl.name === el.cluster);
		if (!cluster) {
			cluster = {
				name: el.cluster,
				children: []
			};
			tree.children.push(cluster);
		}
		let group = cluster.children.find((gr) => gr.name === el.group);
		if (!group) {
			group = {
				name: el.group,
				children: [],
			};
			cluster.children.push(group);
		}
		let item = group.children.find((it) => it.id === el.id);
		if (!item) {
			item = {
				id: el.id,
				name: el.name,
				children: [],
			};
			group.children.push(item);
		}
	}
	return tree;
};

const convertTreeToArray: (tree: TreeData) => Good[] = (tree: TreeData) => {
	const items = [];
	for (const clusterEl of tree.children) {
		for (const groupEl of clusterEl.children) {
			for (const itemEl of groupEl.children) {
				const item: Good = {
					id: itemEl.id ?? '',
					name: itemEl.name,
					group: groupEl.name,
					cluster: clusterEl.name,
				};
				items.push(item);
			}
		}
	}
	return items;
};


export const GoodsTree = () => {
	const initialData = buildTreeData(dataJson);
	const [data, setData] = useState(initialData);

	const nodeClickHandler = (node: HierarchyCircularNode<TreeData>, event: PointerEvent) => {
		console.log(node);
		console.log(event);
	};

	const linkClickHandler = (source: HierarchyCircularNode<TreeData>, target: HierarchyCircularNode<TreeData>, event: PointerEvent) => {
		console.log(source);
		console.log(target);
		console.log(event);
	};

	return (
		<>
			<AppTreeD3 data={data}
				onNodeClick={nodeClickHandler}
				onLinkClick={linkClickHandler}
			></AppTreeD3>
			<button onClick={() => setData(initialData.children[0])}>
				Update data
			</button>
		</>
	);
};
