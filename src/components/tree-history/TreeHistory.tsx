import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import './tree-history.css';
import { setTree } from '../../store/tree/tree-slice';

export const TreeHistory = () => {
	const dispatch = useDispatch();

	const history = useSelector((state: RootState) => state.tree.history);
	const selectedTime = useSelector((state: RootState) => state.tree.currentValue.time);
	const formatDate = (date: number) => (new Date(date).toLocaleString());
	const isSelectedDate = (date: number) => (selectedTime === date);

	return (
		<div className="history-container">
			<div className="history-title">История изменений</div>
			<div className="history-items-container">
				{history.map((item, index) => (
					<div key={index}
						className={isSelectedDate(item.time) ? 'history-item selected-item' : 'history-item'}
						onClick={() => dispatch(setTree(item))}>
						{formatDate(item.time)}
					</div>
				))}
			</div>
		</div>
	);
};
