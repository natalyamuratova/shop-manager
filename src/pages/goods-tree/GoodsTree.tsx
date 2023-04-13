import React, {useState} from 'react';
import './goods-tree.css';
import dataJson from '../../data.json';
import {AppTree, TreeData} from "../../components/app-tree/AppTree";
import {AppTreeD3} from "../../components/app-tree-d3/AppTreeD3";

interface Good {
    id: string;
    name: string;
    group: string;
    cluster: string;
}

const buildTreeData: (data: Good[]) => TreeData = (data: Good[]) => {
    const tree: TreeData = { name: '', children: [] };

    for (let el of data) {
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
}



export const GoodsTree = () => {
    const initialData = buildTreeData(dataJson);
    const [data, setData] = useState(initialData);

    const nodeClickHandler = (node: TreeData) => {
        console.log(node);
    };

        // <AppTree data={data}/>
    return (
        <AppTreeD3 data={data}
                   onNodeClick={nodeClickHandler}
        ></AppTreeD3>
    );
}
