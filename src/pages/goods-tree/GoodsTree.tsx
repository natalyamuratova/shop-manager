import React, { useEffect, useState } from 'react';
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
import { findNode } from '../../utils/data-utils';

export const GoodsTree = () => {
	const dispatch = useDispatch();

	const tree = useSelector((state: RootState) => state.tree.value);
	const [selectedNode, setSelectedNode] = useState<TreeData | null>(null);
	const [parentNode, setParentNode] = useState<TreeData | null>(null);
	const [childNode, setChildNode] = useState<TreeData | null>(null);
	const [childNodesArr, setChildNodesArr] = useState<TreeData[]>([]);

	const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
	const [linkModalTitle, setLinkModalTitle] = useState('');
	const showLinkModal = () => {
		setIsLinkModalOpen(true);
	};
	const linkModalAcceptFn = () => {
		if (parentNode && childNode) {
			dispatch(deleteLink({ source: parentNode, target: childNode }));
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


	const linkClickHandler = (source: HierarchyCircularNode<TreeData>, target: HierarchyCircularNode<TreeData>) => {
		setParentNode(source.data);
		setChildNode(target.data);

		setLinkModalTitle(`${source.data.name} - ${target.data.name}`);
		showLinkModal();
	};
	const nodeClickHandler = (node: HierarchyCircularNode<TreeData>) => {
		setSelectedNode(node.data);
		setParentNode(node.parent?.data ?? null);
		setChildNodesArr((node.children ?? []).map((child) => child.data));

		setNodeModalTitle(node.data.name);
		showNodeModal();
	};

	const [nodesToUnlink, setNodesToUnlink] = useState<TreeData[]>([]);
	const addNodeToUnlink = (node: TreeData) => { setNodesToUnlink([...nodesToUnlink, node]); };
	const removeNodeFromUnlink = (node: TreeData) => { setNodesToUnlink(nodesToUnlink.filter(unlinkedNode => unlinkedNode.id !== node.id )); };
	const deleteNodesFromChildren = (): void => {
		nodesToUnlink.forEach(node => {
			const target = childNodesArr.find(el => el.id === node.id);
			if (!target) {
				return;
			}
			setChildNodesArr(childNodesArr.filter(childNode => childNode.id !== target?.id));
			dispatch(deleteLink({ source: selectedNode ?? null, target }));
		});
	};

	useEffect(() => setChildNodesArr(findNode(tree, selectedNode?.id ?? '')?.children ?? []), [tree]);

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
