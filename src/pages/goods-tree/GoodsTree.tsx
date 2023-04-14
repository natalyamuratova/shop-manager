import React, { useState } from 'react';
import './goods-tree.css';
import { AppTreeD3 } from '../../components/app-tree-d3/AppTreeD3';
import { HierarchyCircularNode } from 'd3';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import TreeData from '../../models/tree-data';
import { buildTree, deleteLink } from '../../store/tree/tree-slice';
import { Modal } from 'antd';

export const GoodsTree = () => {
	const dispatch = useDispatch();
	const tree = useSelector((state: RootState) => state.tree.value);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalTitle, setModalTitle] = useState('');

	const showModal = () => {
		setIsModalOpen(true);
	};

	const handleOk = () => {
		if (parentNode && childNode) {
			dispatch(deleteLink({ source: parentNode, target: childNode }));
		}
		setIsModalOpen(false);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	const nodeClickHandler = (node: HierarchyCircularNode<TreeData>, event: PointerEvent) => {
		console.log(node);
		console.log(event);
	};

	const linkClickHandler = (source: HierarchyCircularNode<TreeData>, target: HierarchyCircularNode<TreeData>, event: PointerEvent) => {
		setParentNode(source.data);
		setChildNode(target.data);

		setModalTitle(`${source.data.name} - ${target.data.name}`);
		showModal();
	};

	const [parentNode, setParentNode] = useState<TreeData | null>(null);
	const [childNode, setChildNode] = useState<TreeData | null>(null);

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
			<Modal title={modalTitle} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
				<div className="modal-content">
					<p>Вы уверены, что хотите удалить связь?</p>
				</div>
			</Modal>
		</>
	);
};
