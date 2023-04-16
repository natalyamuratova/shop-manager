import { Button } from 'antd';
import { saveTreeToFile } from '../../store/tree/tree-slice';
import React from 'react';
import { useDispatch } from 'react-redux';
import './tree-actions-toolbar.css';

export const TreeActionsToolbar = () => {
	const dispatch = useDispatch();

	return (
		<Button onClick={() => dispatch(saveTreeToFile())}>
				Выгрузить дерево в файл
		</Button>
	);
};
