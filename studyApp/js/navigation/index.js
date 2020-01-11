import React from 'react';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {connect} from 'react-redux';
import {
  createReactNavigationReduxMiddleware,
  reduxifyNavigator,
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
      // header: null,
    },
  },
});

export const RootNavigator = createAppContainer(
  createSwitchNavigator(
    {
      IniRoute: initNavigation,
      MainRoute: mainNavigation,
    },
    {
      initialRouteName: 'IniRoute',
    },
  ),
);

export const middleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav,
);

const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root');

const mapStateToProps = state => ({
  state: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
