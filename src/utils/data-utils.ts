import ItemType from '../models/item-type';
import TreeData from '../models/tree-data';

export const findNode = (root: TreeData, targetId: string): TreeData | null => {
	if (root?.id === targetId) {
		return root;
	}
	for (const childNode of root.children) {
		const foundedChild = findNode(childNode, targetId);
		if (foundedChild) {
			return foundedChild;
		}
	}
	return null;
};

export const isRoot = (type?: ItemType) => type === ItemType.ROOT;

export const isCluster = (type?: ItemType) => type === ItemType.CLUSTER;

export const isGroup = (type?: ItemType) => type === ItemType.GROUP;

export const isProduct = (type?: ItemType) => type === ItemType.PRODUCT;

export const getChildNodeType = (parentType?: ItemType) => isRoot(parentType) ? ItemType.CLUSTER : isCluster(parentType) ? ItemType.GROUP : ItemType.PRODUCT;
