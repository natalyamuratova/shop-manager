import React, { useState } from 'react';
import './goods-tree.css';
import { AppTreeD3 } from '../../components/app-tree-d3/AppTreeD3';
import { HierarchyCircularNode } from 'd3';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import TreeData from '../../models/tree-data';
import { deleteLink } from '../../store/tree/tree-slice';
import { Modal } from 'antd';
import { NodeModalContent } from '../../components/node-modal-content/NodeModalContent';
import { TreeActionsToolbar } from '../../components/tree-actions-toolbar/TreeActionsToolbar';
import { TreeHistory } from '../../components/tree-history/TreeHistory';

export const GoodsTree = () => {
	const dispatch = useDispatch();

	const tree = useSelector((state: RootState) => state.tree.currentValue.data);
	const [selectedNode, setSelectedNode] = useState<HierarchyCircularNode<TreeData> | null>(null);
	const [parentNode, setParentNode] = useState<HierarchyCircularNode<TreeData> | null>(null);
	const [childNode, setChildNode] = useState<HierarchyCircularNode<TreeData> | null>(null);
	const [childNodesArr, setChildNodesArr] = useState<HierarchyCircularNode<TreeData>[]>([]);

	const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
	const [linkModalTitle, setLinkModalTitle] = useState('');
	const showLinkModal = () => {
		setIsLinkModalOpen(true);
	};
	const linkModalAcceptFn = () => {
		if (parentNode && childNode) {
			dispatch(deleteLink({ source: parentNode.data, target: childNode.data }));
		}
		setIsLinkModalOpen(false);
	};
	const linkModalCancelFn = () => {
		setIsLinkModalOpen(false);
	};

	const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
	const [nodeModalTitle, setNodeModalTitle] = useState('');
	const showNodeModal = () => {
		setIsNodeModalOpen(true);
	};
	const nodeModalAcceptFn = () => {
		setIsNodeModalOpen(false);
	};
	const nodeModalCancelFn = () => {
		setIsNodeModalOpen(false);
	};

	const linkClickHandler = (source: HierarchyCircularNode<TreeData>, target: HierarchyCircularNode<TreeData>, event: PointerEvent) => {
		setParentNode(source);
		setChildNode(target);

		setLinkModalTitle(`${source.data.name} - ${target.data.name}`);
		showLinkModal();
	};
	const nodeClickHandler = (node: HierarchyCircularNode<TreeData>, event: PointerEvent) => {
		setSelectedNode(node);
		setParentNode(node.parent);
		setChildNodesArr(node.children ?? []);

		setNodeModalTitle(node.data.name);
		showNodeModal();
	};

	const deleteNodeFromChildren = (nodeData: TreeData): void => {
		let target: TreeData | null = null;

		setChildNodesArr(childNodesArr?.filter(child => {
			if (child.data.id === nodeData.id) {
				target = child.data;
				return false;
			}
			return true;
		}));

		if (!target) {
			return;
		}
		dispatch(deleteLink({ source: selectedNode?.data ?? null, target }));
	};

	return (
		<>
			<div className="tree-container">
				<TreeHistory></TreeHistory>
				<AppTreeD3 data={tree}
					onNodeClick={nodeClickHandler}
					onLinkClick={linkClickHandler}
				></AppTreeD3>
			</div>
			<TreeActionsToolbar/>
			<Modal title={linkModalTitle} open={isLinkModalOpen} onOk={linkModalAcceptFn} onCancel={linkModalCancelFn}>
				<div className="modal-content">
					<p>Вы уверены, что хотите удалить связь?</p>
				</div>
			</Modal>
			<Modal title={nodeModalTitle} open={isNodeModalOpen} onOk={nodeModalAcceptFn} onCancel={nodeModalCancelFn}>
				<NodeModalContent parentNode={parentNode} selectedNode={selectedNode} childNodes={childNodesArr} deleteChildAction={deleteNodeFromChildren}/>
			</Modal>
		</>
	);
};
