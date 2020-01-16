import React from 'react';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {connect} from 'react-redux';
import {
  createReactNavigationReduxMiddleware,
  createReduxContainer,
} from 'react-navigation-redux-helpers';
import HomePage from '../page/HomePage';
import DetailPage from '../page/DetailPage';
import WelcomePage from '../page/WelcomePage';

/**
 *  启动页面路由
 */
const initNavigation = createStackNavigator({
  WelcomePage: {
    screen: WelcomePage,
    navigationOptions: {
      header: null,
    },
  },
});

/**
 * 全局页面路由
 */
const mainNavigation = createStackNavigator({
  HomePage: {
    screen: HomePage,
    navigationOptions: {
      header: null,
    },
  },
  DetailPage: {
    screen: DetailPage,
    navigationOptions: {
      header: null,
    },
  },
});

export const rootCom = 'Init';

/**
 * 根路由
 */
export const RootNavigator = createAppContainer(
  createSwitchNavigator(
    {
      Init: initNavigation,
      Main: mainNavigation,
    },
    {
      initialRouteName: 'Init',
    },
  ),
);

/**
 * .初始化react-navigation与redux的中间件
 */
export const middleware = createReactNavigationReduxMiddleware(
  state => state.nav,
  'root',
);

/**
 * 2.将根导航器组件传递给 createReduxContainer 函数,
 * 并返回一个将navigation state 和 dispatch 函数作为 props的新组件；
 *
 * */

const AppWithNavigationState = createReduxContainer(RootNavigator, 'root');

/**
 * 订阅store
 */
const mapStateToProps = state => ({
  state: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
