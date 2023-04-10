import React from 'react';
import Tree from 'react-d3-tree';
import './app-tree.css';

const data = {
    name: 'Молочные продукты',
    children: [
        {
            name: 'Творог',
            children: [
                { name: 'Иван Поддубный' },
                { name: 'Вкуснотеево' },
            ],
        },
    ],
};

export interface TreeData {
    id?: string;
    name: string;
    children: TreeData[];
}

interface AppTreeProps {
    data: TreeData;
}

export const AppTree = (props: AppTreeProps) => {
    const { data } = props;
    return (
        <div id="treeWrapper" style={{ width: '100em', height: '100em' }}>
            <Tree
                data={data}
                rootNodeClassName="node__root"
                branchNodeClassName="node__branch"
                leafNodeClassName="node__leaf"
            />
        </div>
    );
}
