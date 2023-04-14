import dataJson from '../data.json';

export const getAllClusterNames = () => Object.keys(dataJson.clusters);

export const getAllGroupNames = () => Object.values(dataJson.clusters).flatMap(cluster => cluster.groups);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const getAllGroupsByClusterName = (clusterName: string) => dataJson.clusters[clusterName];

export const getAllItemNames = () => dataJson.items.map(item => item.name);

export const isCluster = (name: string) => !!getAllClusterNames().find(clusterName => clusterName === name);

export const isGroup = (name: string) => !!getAllGroupNames().find(groupName => groupName === name);

export const isItem = (name: string) => !!getAllItemNames().find(itemName => itemName === name);

export const getNodeTypeByName = (name: string) => isCluster(name) ? 'Кластер' : isGroup(name) ? 'Группа' : isItem(name) ? 'Товары' : '';
