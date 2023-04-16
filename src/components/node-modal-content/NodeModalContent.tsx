import { Button, Checkbox, Input, Modal } from 'antd';
import React, { useState } from 'react';
import { getChildItemType, isCluster, isProduct } from '../../utils/data-utils';
import { ItemTypeNames } from '../../models/item-type';
import TreeData from '../../models/tree-data';
import Item from '../../models/item';
import { useDispatch } from 'react-redux';
import { addLink } from '../../store/tree/tree-slice';
import './node-modal-content.css';

interface NodeModalContentProps {
	parentNode: TreeData | null;
	selectedNode: TreeData | null;
	childNodes: TreeData[];
	nodesToUnlink: TreeData[];
	addNodeToUnlink: (node: TreeData) => void;
	removeNodeFromUnlink: (node: TreeData) => void;
}

export const NodeModalContent = (props: NodeModalContentProps) => {
	const dispatch = useDispatch();
	const isNodeSelectedToUnlink = (node: TreeData) => !!props.nodesToUnlink.find(selectedNode => selectedNode.id === node.id);

	const [newItem, setNewItem] = useState<Partial<Item>>({
		name: '',
		meaningful: true,
	});
	const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
	const openModal = () => { setIsAddItemModalOpen(true); };
	const closeModal = () => { setIsAddItemModalOpen(false); };
	const addItem = () => {
		if (props.selectedNode && newItem) {
			dispatch(addLink({ parentNode: props.selectedNode, newItem }));
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
			{props.parentNode && !isCluster(props.selectedNode?.type) && <div className="data-section">
				<div className="node-data">
					<h3>{ItemTypeNames[props.parentNode.type]}</h3>
					<p>{props.parentNode?.name}</p>
				</div>
			</div>}
			{!isProduct(props.selectedNode?.type) && <div className="data-section">
				<div className="node-data">
					<h3>{props.selectedNode?.type && ItemTypeNames[getChildItemType(props.selectedNode.type)]}</h3>
					<Button onClick={openModal}>Добавить</Button>
				</div>
				{(props.childNodes ?? []).map(node => <div className='node-data' key={node.id}>
					<p key={node.name}>{node.name}</p>
					{!isNodeSelectedToUnlink(node) && <Button onClick={() => props.addNodeToUnlink(node)}>Удалить</Button>}
					{isNodeSelectedToUnlink(node) && <Button onClick={() => props.removeNodeFromUnlink(node)}>Отмена</Button>}
				</div>)}
			</div>}
			<Modal title={`Добавить ${ItemTypeNames[props.childNodes?.[0]?.type]?.toLowerCase() ?? ''}`} open={isAddItemModalOpen} onOk={addItem} onCancel={closeModal}>
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
