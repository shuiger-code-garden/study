import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import NavigationUtil from '../navigation/navigationUtil';

export default class PopularPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topTabs: ['JavaScript', 'PHP', 'C', 'C++', 'java', 'Node'],
    };
  }
  handleForEachTopTabs() {
    let tabList = {};
    let {topTabs} = this.state;
    topTabs.forEach((item, index) => {
      tabList[`PopularTab${index}`] = {
        screen: props => <PopularTab {...props} contentItem={item} />,
        navigationOptions: {
          tabBarLabel: item,
        },
      };
    });

    return tabList;
  }
  handelTabNavigation() {
    return createAppContainer(
      createMaterialTopTabNavigator(this.handleForEachTopTabs(), {
        tabBarOptions: {
          upperCaseLabel: false,
          scrollEnabled: true,
          style: styles.tabHurdle,
          tabStyle: styles.tabStyle,
          indicatorStyle: styles.indicatorStyle,
          labelStyle: styles.labelStyle,
        },
      }),
    );
  }
  render() {
    let TabNavigation = this.handelTabNavigation();
    return (
      <View style={styles.wrapper}>
        <TabNavigation />
      </View>
    );
  }
}

class PopularTab extends Component {
  render() {
    let {contentItem} = this.props;
    return (
      <View>
        <Text onPress={() => NavigationUtil.goPage('DetailPage', {})}>
          {contentItem}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  tabHurdle: {
    backgroundColor: '#808080',
  },
  tabStyle: {
    minWidth: 50,
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: '#FFF',
  },
  labelStyle: {
    fontSize: 16,
  },
});
