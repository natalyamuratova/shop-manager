import { Button, Checkbox, Input, Modal } from 'antd';
import React, { useState } from 'react';
import { getChildNodeType, isCluster, isProduct } from '../../utils/data-utils';
import { ItemTypeNames } from '../../models/item-type';
import { HierarchyCircularNode } from 'd3';
import TreeData from '../../models/tree-data';
import Item from '../../models/item';
import { useDispatch } from 'react-redux';
import { addLink } from '../../store/tree/tree-slice';

interface NodeModalContentProps {
	parentNode: HierarchyCircularNode<TreeData> | null;
	selectedNode: HierarchyCircularNode<TreeData> | null;
	childNodes: HierarchyCircularNode<TreeData>[];
	nodesToUnlink: HierarchyCircularNode<TreeData>[];
	addNodeToUnlink: (node: HierarchyCircularNode<TreeData>) => void;
	removeNodeFromUnlink: (node: HierarchyCircularNode<TreeData>) => void;
}

export const NodeModalContent = (props: NodeModalContentProps) => {
	const dispatch = useDispatch();
	const isNodeSelectedToUnlink = (node: HierarchyCircularNode<TreeData>) => !!props.nodesToUnlink.find(selectedNode => selectedNode.data.id === node.data.id);

	const [newItem, setNewItem] = useState<Partial<Item>>({
		name: '',
		meaningful: true,
	});
	const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
	const openModal = () => { setIsAddItemModalOpen(true); };
	const closeModal = () => { setIsAddItemModalOpen(false); };
	const addItem = () => {
		if (props.selectedNode && newItem) {
			dispatch(addLink({ parentNode: props.selectedNode?.data, newItem }));
			setNewItem({
				name: '',
				meaningful: true,
			});
		}
		closeModal();
	};

	const onItemNameInput = (event: React.ChangeEvent<HTMLInputElement>) => { setNewItem({ ...newItem, name: event.target.value }); };
	const changeItemMeaningfulStatus = (value: boolean) => { setNewItem({ ...newItem, meaningful: value }); };

	return (
		<div className="modal-content">
			{props.parentNode && !isCluster(props.selectedNode?.data.type) && <div className="data-section">
				<div className="node-data">
					<h3>{ItemTypeNames[props.parentNode.data.type]}</h3>
					<p>{props.parentNode?.data.name}</p>
				</div>
			</div>}
			{props.selectedNode?.children?.length !== 0 && !isProduct(props.selectedNode?.data.type) && <div className="data-section">
				<div className="node-data">
					<h3>{props.selectedNode?.data.type && ItemTypeNames[getChildNodeType(props.selectedNode.data.type)]}</h3>
					<Button onClick={openModal}>Добавить</Button>
				</div>
				{(props.childNodes ?? []).map(node => <div className='node-data' key={node.data.id}>
					<p key={node.data.name}>{node.data.name}</p>
					{!isNodeSelectedToUnlink(node) && <Button onClick={() => props.addNodeToUnlink(node)}>Удалить</Button>}
					{isNodeSelectedToUnlink(node) && <Button onClick={() => props.removeNodeFromUnlink(node)}>Отмена</Button>}
				</div>)}
			</div>}
			<Modal title={`Добавить ${ItemTypeNames[props.childNodes?.[0]?.data?.type]?.toLowerCase() ?? ''}`} open={isAddItemModalOpen} onOk={addItem} onCancel={closeModal}>
				<div className="modal-content">
					<Input
						placeholder={'Введите название элемента'}
						onChange={(e) => onItemNameInput(e)}
						value={newItem.name}/>
					<Checkbox
						checked={!!newItem.meaningful}
						onClick={() => changeItemMeaningfulStatus(!newItem.meaningful)}>Значащий товар</Checkbox>
				</div>
			</Modal>
		</div>
	);
};
