import ItemType from './item-type';
import { Node } from './node';

interface TreeData extends Node {
	id: string;
	type: ItemType,
	children: TreeData[];
}

export default TreeData;
