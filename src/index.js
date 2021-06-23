import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createHashHistory } from 'history';
import { BrowserRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import { combineReducers, compose, createStore, applyMiddleware } from 'redux';
import {UserReducer} from './Store/Reducers'
import { Provider } from 'react-redux';
const hist = createHashHistory();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
    authReducer: UserReducer,

});


const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
ReactDOM.render(
    <React.StrictMode>
         <Provider store={store}>
            <BrowserRouter history={hist}>
                <App />
            </BrowserRouter></Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
