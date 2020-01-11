import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {middleware} from '../navigation/AppNavigation';
import reducers from './reducers';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const middlewares = [thunk, middleware];

const enhancer = composeEnhancers(applyMiddleware(...middlewares));

export default createStore(reducers, enhancer);
