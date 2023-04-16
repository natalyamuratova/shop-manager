import Item from '../models/item';
import TreeData from '../models/tree-data';
import ItemType from '../models/item-type';

export const convertArrayToTree: (data: Item[]) => TreeData = (data: Item[]) => {
	const tree: TreeData = { id: crypto.randomUUID(), name: 'Товары', type: ItemType.ROOT, children: [] };

	for (const el of data) {
		let cluster = tree.children.find((cl) => cl.name === el.cluster);
		if (!cluster) {
			cluster = {
				id: crypto.randomUUID(),
				name: el.cluster,
				type: ItemType.CLUSTER,
				children: [],
			};
			tree.children.push(cluster);
		}
		let group = cluster.children.find((gr) => gr.name === el.group);
		if (!group) {
			group = {
				id: crypto.randomUUID(),
				name: el.group,
				type: ItemType.GROUP,
				children: [],
			};
			cluster.children.push(group);
		}
		let item = group.children.find((it) => it.id === el.id);
		if (!item) {
			item = {
				id: el.id,
				meaningful: el.meaningful === 'true',
				name: el.name,
				type: ItemType.PRODUCT,
				children: [],
			};
			group.children.push(item);
		}
	}
	return tree;
};

export const convertTreeToArray: (tree: TreeData) => Item[] = (tree: TreeData) => {
	const items = [];
	for (const clusterEl of tree.children) {
		for (const groupEl of clusterEl.children) {
			for (const itemEl of groupEl.children) {
				const item: Item = {
					id: itemEl.id ?? '',
					meaningful: String(itemEl.meaningful ?? false),
					name: itemEl.name,
					group: groupEl.name,
					cluster: clusterEl.name,
				};
				items.push(item);
			}
		}
	}
	return items;
};