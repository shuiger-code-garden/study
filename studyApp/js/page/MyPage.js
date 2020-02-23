import React, {Component} from 'react';
import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MORE_MENU} from '../common/MORE_MENU';
import ViewUtil from '../util/ViewUtil';
import GlobalStyles from '../res/styles/GlobalStyles';
import NavigationUtil from '../navigation/navigationUtil';

export const FLAG_ABOUT = {flag_about: 'about', flag_about_me: 'about_me'};
/**
 *  组合模式=》 数据层 + 生成模板的函数
 *
 * @export
 * @class MyPage
 * @extends {Component}
 */
export default class MyPage extends Component {
  onClick(menu) {
    let RouteName,
      params = {};
    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = 'WebViewPage';
        params.title = '教程';
        params.url = 'https://coding.m.imooc.com/classindex.html?cid=89';
        break;
      case MORE_MENU.About:
        RouteName = 'AboutPage';
        break;
      case MORE_MENU.About_Author:
        RouteName = 'AboutMePage';
        break;
    }
    if (RouteName) {
      NavigationUtil.goPage(RouteName, params);
    }
  }
  getItem(menu) {
    let {theme} = this.props;
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, theme);
  }
  render() {
    let statusBar = {
      backgroundColor: 'darkgray',
      barStyle: 'light-content',
    };
    let navigationBar = <NavigationBar title={'我的'} statusBar={statusBar} />;
    return (
      <View style={GlobalStyles.root_container}>
        {navigationBar}
        <ScrollView>
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              this.onClick(MORE_MENU.About);
            }}>
            <View>
              <Ionicons name={MORE_MENU.About.icon} size={40} />
              <Text>GitHub Popular</Text>
            </View>
            <Ionicons name={'ios-arrow-forward'} size={16} />
          </TouchableOpacity>
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Tutorial)}
          {/*趋势管理*/}
          <Text style={styles.groupTitle}>趋势管理</Text>
          {/*自定义语言*/}
          {this.getItem(MORE_MENU.Custom_Language)}
          {/*语言排序*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Sort_Language)}

          {/*最热管理*/}
          <Text style={styles.groupTitle}>最热管理</Text>
          {/*自定义标签*/}
          {this.getItem(MORE_MENU.Custom_Key)}
          {/*标签排序*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Sort_Key)}
          {/*标签移除*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Remove_Key)}

          {/*设置*/}
          <Text style={styles.groupTitle}>设置</Text>
          {/*自定义主题*/}
          {this.getItem(MORE_MENU.Custom_Theme)}
          {/*关于作者*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.About_Author)}
          <View style={GlobalStyles.line} />
          {/*反馈*/}
          {this.getItem(MORE_MENU.Feedback)}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.CodePush)}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 90,
    padding: 10,
    backgroundColor: 'white',
  },
  groupTitle: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,
    color: 'gray',
  },
});
