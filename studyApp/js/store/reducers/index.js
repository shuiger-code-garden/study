import {combineReducers} from 'redux';
import {RootNavigator, rootCom} from '../../navigation/AppNavigation';
import theme from './theme';
import popular from './popular';
import trending from './trending';

/**
 * 设置默认state
 */
const navState = RootNavigator.router.getStateForAction(
  RootNavigator.router.getActionForPathAndParams(rootCom),
);

/**
 * 设置导航的reducer
 */

const navReducer = (state = navState, action) => {
  const nextState = RootNavigator.router.getStateForAction(action, state);
  return nextState || state;
};

/**
 * 合并reducer
 */

const reducers = combineReducers({
  nav: navReducer,
  theme: theme,
  popular: popular,
  trending: trending,
});

export default reducers;
