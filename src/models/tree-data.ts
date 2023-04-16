import ItemType from './item-type';

interface TreeData {
	id?: string;
	name: string;
	type: ItemType,
	children: TreeData[];
}

export default TreeData;
