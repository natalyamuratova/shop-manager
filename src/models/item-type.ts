enum ItemType {
	ROOT = 'root',
	CLUSTER = 'cluster',
	GROUP = 'group',
	PRODUCT = 'product',
}

export const ItemTypeNames = {
	[ItemType.ROOT]: 'Товары',
	[ItemType.CLUSTER]: 'Кластер',
	[ItemType.GROUP]: 'Группы',
	[ItemType.PRODUCT]: 'Продукты',
};

export default ItemType;
