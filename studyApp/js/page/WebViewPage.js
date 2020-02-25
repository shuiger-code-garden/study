import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import NavigationBar from '../common/NavigationBar';
import BackPressComponent from '../common/BackPressComponent';
import {DeviceInfo, SafeAreaView, StyleSheet} from 'react-native';
import GlobalStyles from '../res/styles/GlobalStyles';
import ViewUtil from '../util/ViewUtil';
import NavigationUtil from '../navigation/navigationUtil';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';

/**
 * 通过路由参数加载不同网页
 *
 * @export
 * @class WebViewPage
 * @extends {Component}
 */
export default class WebViewPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;

    let {title, url} = this.params;
    this.state = {
      title: title,
      url: url,
      canGoBack: false,
    };
    // 实列化物理返回键按钮的组件
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
    this.onBack();
    return true;
  }
  onBack() {
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
  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url,
    });
  }

  render() {
    let navigation = (
      <NavigationBar
        title={this.state.title}
        leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      />
    );
    return (
      <SafeAreaViewPlus>
        {navigation}
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
  container: {
    flex: 1,
    // 判断设备是否isIPhoneX 增加顶部margin值
    marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0,
  },
});
