import React from 'react';
import './goods-tree.css';
import { AppTreeD3 } from '../../components/app-tree-d3/AppTreeD3';
import { HierarchyCircularNode } from 'd3';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import TreeData from '../../models/tree-data';
import { buildTree } from '../../store/tree/tree-slice';

export const GoodsTree = () => {
	const dispatch = useDispatch();
	const tree = useSelector((state: RootState) => state.tree.value);

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
			<AppTreeD3 data={tree}
				onNodeClick={nodeClickHandler}
				onLinkClick={linkClickHandler}
			></AppTreeD3>
			<button onClick={() => dispatch(buildTree())}>
				Update data
			</button>
		</>
	);
};
