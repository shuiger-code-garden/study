import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewPropTypes,
  StatusBar,
  Platform,
  DeviceInfo,
} from 'react-native';
import {PropTypes} from 'prop-types';
const StatusBarShape = {
  //设置状态栏所接受的属性
  barStyle: PropTypes.oneOf(['light-content', 'default']),
  hidden: PropTypes.bool,
  backgroundColor: PropTypes.string,
};
const NAV_BAR_HEIGHT_IOS = 44; //导航栏在iOS中的高度
const NAV_BAR_HEIGHT_ANDROID = 50; //导航栏在Android中的高度
const STATUS_BAR_HEIGHT = DeviceInfo.isIPhoneX_deprecated ? 0 : 20; //状态栏的高度

export default class NavigationBar extends Component {
  //提供属性的类型检查
  static propTypes = {
    style: ViewPropTypes.style, // 自定义组件的样式
    title: PropTypes.string,
    titleView: PropTypes.element, //(react)
    navBarTitleContainer: ViewPropTypes.style, // 标题的样式
    hide: PropTypes.bool,
    statusBar: PropTypes.shape(StatusBarShape),
    rightButton: PropTypes.element,
    leftButton: PropTypes.element,
  };
  //设置默认属性
  static defaultProps = {
    statusBar: {
      barStyle: 'light-content',
      hidden: false,
    },
  };

  getButtonElement(element) {
    return <View style={styles.navBarButton}>{element ? element : null}</View>;
  }

  render() {
    //状态栏
    let statusBar = !this.props.statusBar.hidden ? (
      <View>
        <StatusBar {...this.props.statusBar} />
      </View>
    ) : null;
    // 标题组件
    let titleView = this.props.titleView ? (
      this.props.titleView
    ) : (
      <Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.title}>
        {this.props.title}
      </Text>
    );
    // 导航栏
    let content = this.props.hide ? null : (
      <View style={styles.navBar}>
        {this.getButtonElement(this.props.leftButton)}
        <View
          Style={[
            styles.navBarTitleContainer,
            this.props.navBarTitleContainer,
          ]}>
          {titleView}
        </View>
        {this.getButtonElement(this.props.rightButton)}
      </View>
    );
    return (
      <View style={[styles.container]}>
        {statusBar}
        {content}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  //设置组件样式
  container: {
    backgroundColor: '#2196f3',
  },
  // 设置按钮的样式
  navBarButton: {
    alignItems: 'center',
  },
  // 设置导航的样式
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
  },
  // 设置标题的样式
  navBarTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 40,
    right: 40,
    top: 0,
    bottom: 0,
  },
  //设置文字的样式
  title: {
    fontSize: 20,
    color: 'white',
  },
  statusBar: {
    height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,
  },
});
