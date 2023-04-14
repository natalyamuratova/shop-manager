import React from 'react';
import './App.css';
import { GoodsTree } from './pages/goods-tree/GoodsTree';
import { useDispatch } from 'react-redux';
import { setItems } from './store/tree/items-slice';
import dataJson from './data.json';

function App() {
	const dispatch = useDispatch();
	dispatch(setItems(dataJson));

	return (
		<div className="App">
			<GoodsTree/>
		</div>
	);
}

export default App;
