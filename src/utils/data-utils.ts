import ItemType from '../models/item-type';

export const isCluster = (type?: ItemType) => type === ItemType.CLUSTER;

export const isGroup = (type?: ItemType) => type === ItemType.GROUP;

export const isProduct = (type?: ItemType) => type === ItemType.PRODUCT;
