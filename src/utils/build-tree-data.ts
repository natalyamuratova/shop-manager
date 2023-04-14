import Item from '../models/item';
import TreeData from '../models/tree-data';

const buildTreeData: (data: Item[]) => TreeData = (data: Item[]) => {
	const tree: TreeData = { name: 'Товары', children: [] };

	for (const el of data) {
		let cluster = tree.children.find((cl) => cl.name === el.cluster);
		if (!cluster) {
			cluster = {
				name: el.cluster,
				children: []
			};
			tree.children.push(cluster);
		}
		let group = cluster.children.find((gr) => gr.name === el.group);
		if (!group) {
			group = {
				name: el.group,
				children: [],
			};
			cluster.children.push(group);
		}
		let item = group.children.find((it) => it.id === el.id);
		if (!item) {
			item = {
				id: el.id,
				name: el.name,
				children: [],
			};
			group.children.push(item);
		}
	}
	return tree;
};

export default buildTreeData;