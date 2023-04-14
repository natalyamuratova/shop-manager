import React, { useEffect, useRef, useState } from 'react';
import './goods-tree.css';
import { AppTreeD3 } from '../../components/app-tree-d3/AppTreeD3';
import { HierarchyCircularNode } from 'd3';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import buildTreeData from '../../utils/build-tree-data';
import TreeData from '../../models/tree-data';

export const GoodsTree = () => {
	const items = useSelector((state: RootState) => state.items.value);
	const [treeData, setTreeData] = useState<TreeData>(buildTreeData(items));

	const firstRender = useRef(true);
	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			return;
		}
		setTreeData(buildTreeData(items));
	}, [items]);

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
			<AppTreeD3 data={treeData}
				onNodeClick={nodeClickHandler}
				onLinkClick={linkClickHandler}
			></AppTreeD3>
			<button onClick={() => setTreeData(buildTreeData(items))}>
				Update data
			</button>
		</>
	);
};
