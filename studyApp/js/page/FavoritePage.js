import React, {Component} from 'react';
import {StyleSheet, View, Text, FlatList, RefreshControl} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import {connect} from 'react-redux';
import actions from '../store/action';
import PopularItem from '../common/PopularItem';
import TrendingItem from '../common/TrendingItem';
import NavigationBar from '../common/NavigationBar';
import NavigationUtil from '../navigation/navigationUtil';
import FavoriteDao from '../expand/deo/FavoriteDao';
import {FLAG_STORAGE} from '../expand/deo/DataStore';
import EventBus from 'react-native-event-bus';
import FavoriteUtil from '../util/FavoriteUtil';
import EventBusTypes from '../util/EventBusTypes';

export default class FavoritePage extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let navigationBar = <NavigationBar title={'收藏'} />;
    const TabNavigator = createAppContainer(
      createMaterialTopTabNavigator(
        {
          FavoriteTab1: {
            flag_popular: 'popular',
            screen: props => (
              <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular} />
            ),
            navigationOptions: {
              tabBarLabel: '最热',
            },
          },
          FavoriteTab2: {
            screen: props => (
              <FavoriteTabPage flag={FLAG_STORAGE.flag_trending} {...props} />
            ),
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
    return (
      <View style={styles.wrapper}>
        {navigationBar}
        <TabNavigator />
      </View>
    );
  }
}

class FavoriteTab extends Component {
  constructor(props) {
    super(props);
    const {flag} = this.props;
    this.storeName = flag;
    this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
  }
  componentDidMount() {
    this.loadData(true);
    EventBus.getInstance().addListener(
      EventBusTypes.bottom_tab_select,
      (this.bottomTabSelect = data => {
        if (data.to === 2) {
          this.loadData(false);
        }
      }),
    );
  }
  /**
   * 获取与当前页面有关的数据
   *
   * @returns
   * @memberof FavoriteTab
   */
  _store() {
    const {favorite} = this.props;
    let store = favorite[this.storeName];
    if (!store) {
      //设置默认数据
      store = {
        items: [],
        isLoading: false,
        projectModels: [],
      };
    }
    return store;
  }
  loadData(isShowLoading) {
    const {onLoadFavoriteData} = this.props;
    onLoadFavoriteData(this.storeName, isShowLoading);
  }
  onFavorite(item, isFavorite) {
    FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.storeName);
    //触发事件
    if (this.storeName === FLAG_STORAGE.flag_popular) {
      EventBus.getInstance().fireEvent(EventBusTypes.favorite_changed_popular);
    } else {
      EventBus.getInstance().fireEvent(EventBusTypes.favorite_changed_trending);
    }
  }
  renderItem(data) {
    const {theme} = this.props;
    const item = data.item;
    const Item =
      this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
    return (
      <Item
        theme={theme}
        projectModel={item}
        onSelect={callback => {
          NavigationUtil.goPage('DetailPage', {
            projectModels: item,
            flag: this.storeName,
            callback,
          });
        }}
        onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
      />
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
              onRefresh={() => this.loadData(true)}
              tintColor={theme}
            />
          }
        />
      </View>
    );
  }
}

const mapPopularStateToProps = state => ({
  favorite: state.favorite,
  theme: state.theme.theme,
});

const mapPopularActionToProps = dispatch => ({
  onLoadFavoriteData: (flag, isShowLoading) => {
    dispatch(actions.onLoadFavoriteData(flag, isShowLoading));
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
