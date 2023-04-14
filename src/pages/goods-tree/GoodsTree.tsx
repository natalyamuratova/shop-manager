import React, { useState } from 'react';
import './goods-tree.css';
import { AppTreeD3 } from '../../components/app-tree-d3/AppTreeD3';
import { HierarchyCircularNode } from 'd3';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import TreeData from '../../models/tree-data';
import { buildTree, deleteLink, saveTree } from '../../store/tree/tree-slice';
import { Button, Modal } from 'antd';
import { getNodeTypeByName, isCluster, isItem } from '../../utils/data-utils';

export const GoodsTree = () => {
	const dispatch = useDispatch();
	const tree = useSelector((state: RootState) => state.tree.value);

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

	const deleteNodeFromChildren = (nodeData: TreeData) => {
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

	const nodeClickHandler = (node: HierarchyCircularNode<TreeData>, event: PointerEvent) => {
		console.log(node);
		setSelectedNode(node);
		setParentNode(node.parent);
		setChildNodesArr(node.children);

		setNodeModalTitle(node.data.name);
		showNodeModal();
	};

	const linkClickHandler = (source: HierarchyCircularNode<TreeData>, target: HierarchyCircularNode<TreeData>, event: PointerEvent) => {
		setParentNode(source);
		setChildNode(target);

		setLinkModalTitle(`${source.data.name} - ${target.data.name}`);
		showLinkModal();
	};

	const [selectedNode, setSelectedNode] = useState<HierarchyCircularNode<TreeData> | null>(null);
	const [parentNode, setParentNode] = useState<HierarchyCircularNode<TreeData> | null>(null);
	const [childNode, setChildNode] = useState<HierarchyCircularNode<TreeData> | null>(null);
	const [childNodesArr, setChildNodesArr] = useState<HierarchyCircularNode<TreeData>[] | undefined>([]);

	return (
		<>
			<AppTreeD3 data={tree}
				onNodeClick={nodeClickHandler}
				onLinkClick={linkClickHandler}
				linkClickable={true}
			></AppTreeD3>
			<button onClick={() => dispatch(buildTree())}>
				Восстановить
			</button>
			<button onClick={() => dispatch(saveTree())}>
				Сохранить дерево
			</button>
			<Modal title={linkModalTitle} open={isLinkModalOpen} onOk={linkModalAcceptFn} onCancel={linkModalCancelFn}>
				<div className="modal-content">
					<p>Вы уверены, что хотите удалить связь?</p>
				</div>
			</Modal>
			<Modal title={nodeModalTitle} open={isNodeModalOpen} onOk={nodeModalAcceptFn} onCancel={nodeModalCancelFn}>
				<div className="modal-content">
					{parentNode && !isCluster(selectedNode?.data.name ?? '') && <div className="data-section">
						<div className="node-data">
							<h3>{getNodeTypeByName(parentNode.data.name ?? '')}</h3>
							<Button>Изменить</Button>
						</div>
						<div className="node-data">
							<p>{parentNode?.data.name}</p>
						</div>
					</div>}
					{selectedNode?.children?.length !== 0 && !isItem(selectedNode?.data.name ?? '') && <div className="data-section">
						<div className="node-data">
							<h3>{getNodeTypeByName(childNodesArr?.[0]?.data.name ?? '')}</h3>
							<Button>+</Button>
						</div>
						{(childNodesArr ?? []).map(node => <div className='node-data' key={node.data.id}>
							<p key={node.data.name}>{node.data.name}</p>
							<Button onClick={() => deleteNodeFromChildren(node.data)}>-</Button>
						</div>)}
					</div>}
				</div>
			</Modal>
		</>
	);
};
