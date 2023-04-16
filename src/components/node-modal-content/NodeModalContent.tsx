import { Button } from 'antd';
import React from 'react';
import { isCluster, isProduct } from '../../utils/data-utils';
import { ItemTypeNames } from '../../models/item-type';
import { HierarchyCircularNode } from 'd3';
import TreeData from '../../models/tree-data';

interface NodeModalContentProps {
	parentNode: HierarchyCircularNode<TreeData> | null;
	selectedNode: HierarchyCircularNode<TreeData> | null;
	childNodes: HierarchyCircularNode<TreeData>[];
	nodesToUnlink: HierarchyCircularNode<TreeData>[];
	addNodeToUnlink: (node: HierarchyCircularNode<TreeData>) => void;
	removeNodeFromUnlink: (node: HierarchyCircularNode<TreeData>) => void;
}

export const NodeModalContent = (props: NodeModalContentProps) => {
	const isNodeSelectedToUnlink = (node: HierarchyCircularNode<TreeData>) => !!props.nodesToUnlink.find(selectedNode => selectedNode.data.id === node.data.id);

	return (
		<div className="modal-content">
			{props.parentNode && !isCluster(props.selectedNode?.data.type) && <div className="data-section">
				<div className="node-data">
					<h3>{ItemTypeNames[props.parentNode.data.type]}</h3>
					<Button>Изменить</Button>
				</div>
				<div className="node-data">
					<p>{props.parentNode?.data.name}</p>
				</div>
			</div>}
			{props.selectedNode?.children?.length !== 0 && !isProduct(props.selectedNode?.data.type) && <div className="data-section">
				<div className="node-data">
					<h3>{props.childNodes?.[0]?.data.type && ItemTypeNames[props.childNodes[0].data.type]}</h3>
					<Button>+</Button>
				</div>
				{(props.childNodes ?? []).map(node => <div className='node-data' key={node.data.id}>
					<p key={node.data.name}>{node.data.name}</p>
					{!isNodeSelectedToUnlink(node) && <Button onClick={() => props.addNodeToUnlink(node)}>Удалить</Button>}
					{isNodeSelectedToUnlink(node) && <Button onClick={() => props.removeNodeFromUnlink(node)}>Отмена</Button>}
				</div>)}
			</div>}
		</div>
	);
};
