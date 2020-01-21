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
import PopularItem from '../common/PopularItem';
import NavigationBar from '../common/NavigationBar';
import NavigationUtil from '../navigation/navigationUtil';
import FavoriteDao from '../expand/deo/FavoriteDao';
import {FLAG_STORAGE} from '../expand/deo/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

export default class FavoritePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topTabs: [],
    };
  }
  handelTabNavigation() {
    return createAppContainer(
      createMaterialTopTabNavigator(
        {
          FavoriteTab1: {
            screen: props => <FavoriteTabPage {...props} />,
            navigationOptions: {
              tabBarLabel: '最热',
            },
          },
          FavoriteTab2: {
            screen: props => <FavoriteTabPage {...props} />,
            navigationOptions: {
              tabBarLabel: '趋势',
            },
          },
        },
        {
          tabBarOptions: {
            upperCaseLabel: false,
            style: styles.tabHurdle,
            tabStyle: styles.tabStyle,
            indicatorStyle: styles.indicatorStyle,
            labelStyle: styles.labelStyle,
          },
        },
      ),
    );
  }
  render() {
    let TabNavigation = this.handelTabNavigation();
    return (
      <View style={styles.wrapper}>
        <NavigationBar title={'收藏'} />
        <TabNavigation />
      </View>
    );
  }
}

const pageSize = 10;
class FavoriteTab extends Component {
  constructor(props) {
    super(props);
    this.storeName = this.props.tabLable;
  }
  componentDidMount() {
    this.loadData();
  }
  _store() {
    const {popular} = this.props;
    let store = popular[this.storeName];
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
    const {onRefreshPopular, onLoadMorePopular} = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMorePopular(
        this.storeName,
        store.pageIndex,
        pageSize,
        store.items,
        () => {},
        favoriteDao,
      );
    } else {
      onRefreshPopular(this.storeName, url, pageSize, favoriteDao);
    }
  }
  renderItem(item) {
    const {theme} = this.props;
    return (
      <PopularItem
        projectModel={item.item}
        theme={theme}
        onSelect={callback => {
          NavigationUtil.goPage('DetailPage', {
            projectModels: item.item,
            flag: FLAG_STORAGE.flag_popular,
            callback,
          });
        }}
        //收藏项目或取消项目
        onFavorite={(item, isFavorite) => {
          FavoriteUtil.onFavorite(
            favoriteDao,
            item,
            isFavorite,
            FLAG_STORAGE.flag_popular,
          );
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
  render() {
    let store = this._store();
    const {theme} = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => `${item.item.id}`}
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

const mapPopularStateToProps = state => ({
  popular: state.popular,
  theme: state.theme.theme,
});

const mapPopularActionToProps = dispatch => ({
  onRefreshPopular: (storeName, url, pageSize, favoriteDao) => {
    dispatch(actions.onRefreshPopular(storeName, url, pageSize, favoriteDao));
  },
  onLoadMorePopular: (
    storeName,
    pageIndex,
    pageSize,
    dataArray,
    callback,
    favoriteDao,
  ) => {
    dispatch(
      actions.onLoadMorePopular(
        storeName,
        pageIndex,
        pageSize,
        dataArray,
        callback,
        favoriteDao,
      ),
    );
  },
});

const FavoriteTabPage = connect(
  mapPopularStateToProps,
  mapPopularActionToProps,
)(FavoriteTab);

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
