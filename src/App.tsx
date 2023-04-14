import React from 'react';
import './App.css';
import { GoodsTree } from './pages/goods-tree/GoodsTree';
import { buildTree } from './store/tree/tree-slice';
import { useDispatch } from 'react-redux';

function App() {
	const dispatch = useDispatch();
	dispatch(buildTree());

	return (
		<div className="App">
			<GoodsTree/>
		</div>
	);
}

export default App;
