import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ViewUtil from '../util/ViewUtil';
import {WebView} from 'react-native-webview';
import NavigationBar from '../common/NavigationBar';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NavigationUtil from '../navigation/navigationUtil';
import BackPressComponent from '../common/BackPressComponent';
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
    let {projectModels} = this.params;
    this.url =
      projectModels.html_url || `${TRENDING_URL}${projectModels.fullName}`;
    const title = projectModels.full_name || projectModels.fullName;
    this.state = {
      title: title,
      url: this.url,
      canGoBack: false,
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
  renderRightButton() {
    return (
      <View style={styles.rightBtn}>
        <TouchableOpacity>
          <FontAwesome
            name={'star-o'}
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
      <View style={styles.wrapper}>
        {navigationBar}
        <WebView
          ref={webView => (this.webView = webView)}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
          source={{uri: this.state.url}}
        />
      </View>
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
