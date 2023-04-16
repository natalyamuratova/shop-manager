import ItemType from '../models/item-type';
import TreeData from '../models/tree-data';

/**
 * Returns node with given id from tree (null of not found)
 * @param root root of the tree to search from
 * @param targetId id of the requested node
 */
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

/**
 * Returns children type for given type of item
 * @param parentType type to return children type for
 */
export const getChildItemType = (parentType?: ItemType) => isRoot(parentType) ? ItemType.CLUSTER : isCluster(parentType) ? ItemType.GROUP : ItemType.PRODUCT;
