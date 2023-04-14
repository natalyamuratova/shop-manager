interface TreeData {
	id?: string;
	meaningful?: boolean;
	name: string;
	children: TreeData[];
}

export default TreeData;
