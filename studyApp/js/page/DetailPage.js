import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ViewUtil from '../util/ViewUtil';
import {WebView} from 'react-native-webview';
import NavigationBar from '../common/NavigationBar';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NavigationUtil from '../navigation/navigationUtil';
import BackPressComponent from '../common/BackPressComponent';
import FavoriteDao from '../expand/deo/FavoriteDao';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
const TRENDING_URL = 'https://github.com/';
const THEME_COLOR = '#678';

/**
 * 通过 webView onNavigationStateChange 监听路由变化进行回调
 * 判断canGoBack 能否返回webview页面还是原生页面
 *
 */

export default class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    let {projectModels, flag} = this.params;
    this.favoriteDao = new FavoriteDao(flag);
    let projectModel = projectModels.item;
    this.url =
      projectModel.html_url || `${TRENDING_URL}${projectModel.fullName}`;
    const title = projectModel.full_name || projectModel.fullName;
    this.state = {
      title: title,
      url: this.url,
      canGoBack: false,
      isFavorite: projectModels.isFavorite,
    };
    this.backPress = new BackPressComponent({
      backPress: () => this.onBackPress(),
    });
  }
  componentDidMount() {
    this.backPress.componentDidMount();
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }
  onBackPress() {
    this.onGoBack();
    return true;
  }
  onGoBack() {
    if (this.state.canGoBack) {
      this.webView.goBack();
    } else {
      NavigationUtil.goBack({
        params: {
          navigation: this.props.navigation,
        },
      });
    }
  }
  onFavoriteButtonClick() {
    const {projectModels, callback} = this.params;
    const isFavorite = (projectModels.isFavorite = !projectModels.isFavorite);
    callback(isFavorite);
    this.setState({
      isFavorite: isFavorite,
    });
    let key = projectModels.item.fullName
      ? projectModels.item.fullName
      : projectModels.item.id.toString();
    if (projectModels.isFavorite) {
      this.favoriteDao.saveFavoriteItem(
        key,
        JSON.stringify(projectModels.item),
      );
    } else {
      this.favoriteDao.removeFavoriteItem(key);
    }
  }
  renderRightButton() {
    return (
      <View style={styles.rightBtn}>
        <TouchableOpacity onPress={() => this.onFavoriteButtonClick()}>
          <FontAwesome
            name={this.state.isFavorite ? 'star' : 'star-o'}
            size={20}
            style={styles.renderRightBtn}
          />
        </TouchableOpacity>
        {ViewUtil.getShareButton(() => {})}
      </View>
    );
  }
  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
    });
  }
  render() {
    let titleLayoutStyle =
      this.state.title.length > 20 ? {paddingRight: 30} : null;
    let navigationBar = (
      <NavigationBar
        style={{backgroundColor: THEME_COLOR}}
        title={this.state.title}
        titleLayoutStyle={titleLayoutStyle}
        leftButton={ViewUtil.getLeftBackButton(() => {
          this.onGoBack();
        })}
        rightButton={this.renderRightButton()}
      />
    );
    return (
      <SafeAreaViewPlus>
        {navigationBar}
        <WebView
          ref={webView => (this.webView = webView)}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
          source={{uri: this.state.url}}
        />
      </SafeAreaViewPlus>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    color: 'red',
  },
  renderRightBtn: {
    color: 'white',
    marginRight: 10,
  },
  rightBtn: {
    flexDirection: 'row',
  },
});
