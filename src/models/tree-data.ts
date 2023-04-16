import ItemType from './item-type';

interface TreeData {
	id?: string;
	meaningful?: boolean;
	name: string;
	type: ItemType,
	children: TreeData[];
}

export default TreeData;
