import React, {Component} from 'react';
import {createBottomTabNavigator, BottomTabBar} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import PopularPage from '../page/PopularPage';
import TrendingPage from '../page/TrendingPage';
import FavoritePage from '../page/FavoritePage';
import MyPage from '../page/MyPage';

const Tabs = {
  PopularPage: {
    screen: PopularPage,
    navigationOptions: {
      tabBarLabel: '最热',
      tabBarIcon: ({focused, tintColor}) => (
        <MaterialIcons name={'whatshot'} size={26} style={{color: tintColor}} />
      ),
    },
  },
  TrendingPage: {
    screen: TrendingPage,
    navigationOptions: {
      tabBarLabel: '趋势',
      tabBarIcon: ({focused, tintColor}) => (
        <Ionicons
          name={'md-trending-up'}
          size={26}
          style={{color: tintColor}}
        />
      ),
    },
  },
  FavoritePage: {
    screen: FavoritePage,
    navigationOptions: {
      tabBarLabel: '收藏',
      tabBarIcon: ({focused, tintColor}) => (
        <MaterialIcons name={'favorite'} size={26} style={{color: tintColor}} />
      ),
    },
  },
  MyPage: {
    screen: MyPage,
    navigationOptions: {
      tabBarLabel: '我的',
      tabBarIcon: ({focused, tintColor}) => (
        <Entypo name={'user'} size={26} style={{color: tintColor}} />
      ),
    },
  },
};

class TabBarComponent extends Component {
  constructor(props) {
    super(props);
    this.theme = {
      initColor: props.activeTintColor,
      update: new Date().getTime(),
    };
  }
  render() {
    let {navigation} = this.props;
    let {routes, index} = navigation.state;
    if (typeof routes[index].params === 'object') {
      let {initColor, update} = routes[index].params;
      if (update > this.theme.update) {
        this.theme.initColor = initColor ? initColor : this.theme.initColor;
      }
    }

    return (
      <BottomTabBar
        {...this.props}
        activeTintColor={this.theme.initColor || this.props.activeTintColor}
      />
    );
  }
}

export default class DynamicBottomNavigation extends Component {
  handleRendTabNavigation() {
    let {PopularPage, TrendingPage, FavoritePage, MyPage} = Tabs;
    return createAppContainer(
      createBottomTabNavigator(
        {
          PopularPage,
          TrendingPage,
          FavoritePage,
          MyPage,
        },
        {
          tabBarComponent: props => <TabBarComponent {...props} />,
        },
      ),
    );
  }
  render() {
    let TabNavigation = this.handleRendTabNavigation();
    return <TabNavigation />;
  }
}
