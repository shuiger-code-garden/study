import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  Text,
  Platform,
  DeviceInfo,
} from 'react-native';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import BackPressComponent from '../../common/BackPressComponent';
import NavigationUtil from '../../navigation/navigationUtil';
import ViewUtil from '../../util/ViewUtil';
import GlobalStyles from '../../res/styles/GlobalStyles';

/**
 *  props (navaigation, ...)
 *
 * @export
 * @class AboutCommon
 */
export default class AboutCommon {
  constructor(props, updateState) {
    this.props = props;
    this.updateState = updateState;
    this.backPress = new BackPressComponent({
      backPress: () => this.onBackPress(),
    });
  }
  onBackPress() {
    NavigationUtil.goBack(this.props.navigation);
    return true;
  }
  componentDidMount() {
    this.backPress.componentDidMount();
    fetch('http://www.devio.org/io/GitHubPopular/json/github_app_config.json')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network Error');
      })
      .then(config => {
        if (config) {
          this.updateState({
            data: config,
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }
  /**
   *  根据params 动态设置 ParallaxScrollView 参数
   *
   * @param {*} params
   * @memberof AboutCommon
   */
  getParallaxRenderConfig(params) {
    let config = {};
    let avatar =
      typeof params.avatar === 'string' ? {uri: params.avatar} : params.avatar;
    config.renderBackground = () => (
      <View key="background">
        <Image
          source={{
            uri: params.backgroundImg,
            width: window.width,
            height: PARALLAX_HEADER_HEIGHT,
          }}
        />
        <View style={styles.bgView} />
      </View>
    );
    config.renderForeground = () => (
      <View key="parallax-header" style={styles.parallaxHeader}>
        <Image style={styles.avatar} />
        <Text style={styles.sectionSpeakerText}>{params.name}</Text>
        <Text style={styles.sectionTitleText}>{params.description}</Text>
      </View>
    );
    config.renderStickyHeader = () => (
      <View key="sticky-header" style={styles.stickySection}>
        <Text style={styles.stickySectionText}>{params.name}</Text>
      </View>
    );
    config.renderFixedHeader = () => (
      <View key="fixed-header" style={styles.fixedSection}>
        {ViewUtil.getLeftBackButton(() =>
          NavigationUtil.goBack({
            params: this.props.navigation,
          }),
        )}
        {ViewUtil.getShareButton()}
      </View>
    );
    return config;
  }
  render(contentView, params) {
    const renderConfig = this.getParallaxRenderConfig(params);
    return (
      <ParallaxScrollView
        backgroundColor="#333"
        contentBackgroundColor={GlobalStyles.backgroundColor}
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        stickyHeaderHeight={STICKY_HEADER_HEIGHT}
        backgroundSpeed={10}
        {...renderConfig}>
        {contentView}
      </ParallaxScrollView>
    );
  }
}
// 本模块用于获取设备屏幕的宽高。
const window = Dimensions.get('window');
const PARALLAX_HEADER_HEIGHT = 270;
const TOP =
  Platform.OS === 'ios' ? 20 + (DeviceInfo.isIPhoneX_deprecated ? 24 : 0) : 0;
const STICKY_HEADER_HEIGHT =
  Platform.OS === 'ios'
    ? GlobalStyles.nav_bar_height_ios + TOP
    : GlobalStyles.nav_bar_height_android;
const AVATAR_SIZE = 90;

const styles = StyleSheet.create({
  bgView: {
    position: 'absolute',
    top: 0,
    width: window.width,
    backgroundColor: 'rgba(0,0,0,.4)',
    height: PARALLAX_HEADER_HEIGHT,
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT,
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    alignItems: 'center',
    paddingTop: TOP,
  },
  stickySectionText: {
    color: 'white',
    fontSize: 20,
    margin: 10,
  },
  fixedSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: TOP,
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 20,
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 100,
  },
  avatar: {
    marginBottom: 10,
    borderRadius: AVATAR_SIZE / 2,
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 24,
    paddingVertical: 5,
    marginBottom: 10,
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 16,
    marginRight: 10,
    marginLeft: 10,
  },
});
