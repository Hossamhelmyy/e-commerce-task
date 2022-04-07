import React from 'react';
import './index.css';
import App from './App';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { themeReducer } from './store/store';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore(themeReducer);
createRoot(document.querySelector('#root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
		,
	</React.StrictMode>,
);
