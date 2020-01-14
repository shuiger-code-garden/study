import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import {connect} from 'react-redux';
import actions from '../store/action';
import TrendingItem from '../common/TrendingItem';
import NavigationBar from '../common/NavigationBar';
const URL = 'https://github.com/trending/';

export default class TrendingPage extends Component {
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
      tabList[`TrendingTab${index}`] = {
        screen: props => <TrendingTabPage {...props} tabLable={item} />,
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
        <NavigationBar title={'最热'} />
        <TabNavigation />
      </View>
    );
  }
}

const pageSize = 10;
class TrendingTab extends Component {
  constructor(props) {
    super(props);
    this.storeName = this.props.tabLable;
  }
  componentDidMount() {
    this.loadData();
  }
  _store() {
    const {trending} = this.props;
    let store = trending[this.storeName];
    if (!store) {
      //设置默认数据
      store = {
        items: [],
        isLoading: false,
        projectModels: [],
        hideLoadingMore: true,
      };
    }
    return store;
  }
  loadData(loadMore) {
    const {onRefreshTrending, onLoadMoreTrending} = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMoreTrending(
        this.storeName,
        store.pageIndex,
        pageSize,
        store.items,
        () => {},
      );
    } else {
      onRefreshTrending(this.storeName, url, pageSize);
    }
  }
  renderItem(item) {
    const {theme} = this.props;
    return <TrendingItem projectModel={item} theme={theme} />;
  }
  genIndicator() {
    return this._store().hideLoadingMore ? null : (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator style={styles.indicator} />
        <Text>正在加载更多</Text>
      </View>
    );
  }
  genFetchUrl(key) {
    return URL + key + '?since=weekly';
  }
  render() {
    let store = this._store();
    const {theme} = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => `${item.fullName}`}
          refreshControl={
            <RefreshControl
              title={'Loading'}
              titleColor={theme}
              colors={[theme]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
              tintColor={theme}
            />
          }
          ListFooterComponent={() => this.genIndicator()}
          onEndReached={() => {
            console.log('---onEndReached----');
            setTimeout(() => {
              if (this.canLoadMore) {
                //     //fix 滚动时两次调用onEndReached https://github.com/facebook/react-native/issues/14015
                this.loadData(true);
                this.canLoadMore = false;
              }
            }, 100);
          }}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.canLoadMore = true; //fix 初始化时页调用onEndReached的问题
            console.log('---onMomentumScrollBegin-----');
          }}
        />
      </View>
    );
  }
}

const mapTrendingStateToProps = state => ({
  trending: state.trending,
  theme: state.theme.theme,
});

const mapTrendingActionToProps = dispatch => ({
  onRefreshTrending: (storeName, url, pageSize) => {
    dispatch(actions.onRefreshTrending(storeName, url, pageSize));
  },
  onLoadMoreTrending: (storeName, pageIndex, pageSize, dataArray, callback) => {
    dispatch(
      actions.onLoadMoreTrending(
        storeName,
        pageIndex,
        pageSize,
        dataArray,
        callback,
      ),
    );
  },
});

const TrendingTabPage = connect(
  mapTrendingStateToProps,
  mapTrendingActionToProps,
)(TrendingTab);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  tabHurdle: {
    backgroundColor: '#808080',
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
  },
  tabStyle: {
    // minWidth: 50 //fix minWidth会导致tabStyle初次加载时闪烁
    padding: 0,
  },
  labelStyle: {
    fontSize: 13,
    margin: 0,
  },
  indicatorContainer: {
    alignItems: 'center',
  },
  indicator: {
    color: 'red',
    margin: 10,
  },
});
