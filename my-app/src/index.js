import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from "react-redux";
import { legacy_createStore as createStore } from 'redux';
import rootReducer from "./reducers";

import './styles.css'
import './home.css'
const root = ReactDOM.createRoot(document.getElementById('root'));

const store =createStore(rootReducer)

root.render(
    <Provider store={store}>

    <App />
    </Provider>,

);

