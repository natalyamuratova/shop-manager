import { Button } from 'antd';
import { buildTree, saveTree } from '../../store/tree/tree-slice';
import React from 'react';
import { useDispatch } from 'react-redux';
import './tree-actions-toolbar.css';

export const TreeActionsToolbar = () => {
	const dispatch = useDispatch();

	return (
		<>
			<Button onClick={() => dispatch(buildTree())}
					className="restore-button">
				Восстановить
			</Button>
			<Button onClick={() => dispatch(saveTree())}>
				Сохранить дерево
			</Button>
		</>
	);
};
