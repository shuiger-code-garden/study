import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import {connect} from 'react-redux';
import actions from '../store/action';
import TrendingItem from '../common/TrendingItem';
import NavigationBar from '../common/NavigationBar';
import TrendingDialog, {TimeSpans} from '../common/TrendingDialog';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NavigationUtil from '../navigation/navigationUtil';
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE';
const URL = 'https://github.com/trending/';

export default class TrendingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topTabs: ['JavaScript', 'PHP', 'C', 'C++', 'java', 'Node'],
      timeSpan: TimeSpans[0],
    };
  }
  handleForEachTopTabs() {
    let tabList = {};
    let {topTabs} = this.state;
    topTabs.forEach((item, index) => {
      tabList[`TrendingTab${index}`] = {
        screen: props => (
          <TrendingTabPage
            {...props}
            tabLable={item}
            timeSpan={this.state.timeSpan}
          />
        ),
        navigationOptions: {
          tabBarLabel: item,
        },
      };
    });

    return tabList;
  }
  handelTabNavigation() {
    if (!this.tab) {
      this.tab = createAppContainer(
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
    return this.tab;
  }
  renderTitleView() {
    return (
      <View>
        <TouchableOpacity
          underlayColor="transparent"
          onPress={() => this.dialog.show()}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleConText}>
              趋势 {this.state.timeSpan.showText}
            </Text>
            <MaterialIcons
              name={'arrow-drop-down'}
              size={22}
              style={styles.iconColor}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  onSelectTimeSpan(timeSpan) {
    this.dialog.dismiss();
    this.setState(
      {
        timeSpan,
      },
      () => {
        DeviceEventEmitter.emit('EVENT_TYPE_TIME_SPAN_CHANGE', timeSpan);
      },
    );
  }
  onCloseTimeSpan() {}
  renderTrendingPage() {
    return (
      <TrendingDialog
        ref={dialog => (this.dialog = dialog)}
        onSelect={timeSpan => this.onSelectTimeSpan(timeSpan)}
        onClose={() => this.onCloseTimeSpan()}
      />
    );
  }
  render() {
    let TabNavigation = this.handelTabNavigation();
    let navigationBar = <NavigationBar titleView={this.renderTitleView()} />;
    return (
      <View style={styles.wrapper}>
        {navigationBar}
        <TabNavigation />
        {this.renderTrendingPage()}
      </View>
    );
  }
}

const pageSize = 10;
class TrendingTab extends Component {
  constructor(props) {
    super(props);
    let {tabLable, timeSpan} = this.props;
    this.storeName = tabLable;
    this.timeSpan = timeSpan;
  }
  componentDidMount() {
    this.loadData();
    this.EventEmitterLoadData();
  }
  componentWillUnmount() {
    this.listener.remove();
  }
  EventEmitterLoadData() {
    this.listener = DeviceEventEmitter.addListener(
      EVENT_TYPE_TIME_SPAN_CHANGE,
      timeSpan => {
        this.timeSpan = timeSpan;
        this.loadData();
      },
    );
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
        hideLoadingMore: false,
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
    return (
      <TrendingItem
        projectModel={item}
        theme={theme}
        onPress={items => {
          NavigationUtil.goPage('DetailPage', {
            projectModels: items,
          });
        }}
      />
    );
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
    return URL + key + '?' + this.timeSpan.searchText;
  }
  render() {
    let store = this._store();
    const {theme} = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={(item, index) => item.fullName || index}
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleConText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  iconColor: {color: 'white'},
});
