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

export const GoodsTree = () => {
	const dispatch = useDispatch();

	const tree = useSelector((state: RootState) => state.tree.value);
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
		deleteNodesFromChildren();
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

	const [nodesToUnlink, setNodesToUnlink] = useState<HierarchyCircularNode<TreeData>[]>([]);
	const addNodeToUnlink = (node: HierarchyCircularNode<TreeData>) => { setNodesToUnlink([...nodesToUnlink, node]); };
	const removeNodeFromUnlink = (node: HierarchyCircularNode<TreeData>) => { setNodesToUnlink(nodesToUnlink.filter(unlinkedNode => unlinkedNode.data.id !== node.data.id )); };
	const deleteNodesFromChildren = (): void => {
		nodesToUnlink.forEach(node => {
			let target = childNodesArr.find(el => el.data.id === node.data.id);
			if (!target) {
				return;
			}
			setChildNodesArr(childNodesArr.filter(childNode => childNode.data.id !== target?.data.id));
			dispatch(deleteLink({ source: selectedNode?.data ?? null, target: target.data }));
		});
	};

	return (
		<>
			<AppTreeD3 data={tree}
				onNodeClick={nodeClickHandler}
				onLinkClick={linkClickHandler}
				linkClickable={true}
			></AppTreeD3>
			<TreeActionsToolbar/>
			<Modal title={linkModalTitle} open={isLinkModalOpen} onOk={linkModalAcceptFn} onCancel={linkModalCancelFn}>
				<div className="modal-content">
					<p>Вы уверены, что хотите удалить связь?</p>
				</div>
			</Modal>
			<Modal title={nodeModalTitle} open={isNodeModalOpen} onOk={nodeModalAcceptFn} onCancel={nodeModalCancelFn}>
				<NodeModalContent
					parentNode={parentNode}
					selectedNode={selectedNode}
					childNodes={childNodesArr}
					nodesToUnlink={nodesToUnlink}
					addNodeToUnlink={addNodeToUnlink}
					removeNodeFromUnlink={removeNodeFromUnlink}/>
			</Modal>
		</>
	);
};
