import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './components/app/App';
import reportWebVitals from './reportWebVitals';
import { store } from './redux/store';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);

reportWebVitals();
