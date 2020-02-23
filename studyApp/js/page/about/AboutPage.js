import React, {Component} from 'react';
import {View, Linking} from 'react-native';
import AboutCommon from '../../page/about/AboutCommon';
import config from '../../res/data/config.json';
import {connect} from 'react-redux';
import ViewUtil from '../../util/ViewUtil';
import {MORE_MENU} from '../../common/MORE_MENU';
import GlobalStyles from '../../res/styles/GlobalStyles';
import NavigationUtil from '../../navigation/navigationUtil';
const THEME_COLOR = '#678';

class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.aboutCommon = new AboutCommon(
      {
        ...this.params,
        navigation: this.props.navigation,
      },
      data => this.setState({...data}),
    );
    this.state = {
      data: config,
    };
  }
  onClick(menu) {
    let RouteName;
    let params = {};
    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = 'WebViewPage';
        params.title = '教程';
        params.url = 'https://coding.m.imooc.com/classindex.html?cid=89';
        break;
      case MORE_MENU.About_Author:
        RouteName = 'AboutMePage';
        break;
      case MORE_MENU.Feedback:
        const url = 'mailto://crazycodeboy@gmail.com';
        Linking.canOpenURL(url).then(support => {
          if (!support) {
            console.log("Can't handle url: " + url);
          } else {
            Linking.openURL(url);
          }
        });
        break;
    }

    if (RouteName) {
      NavigationUtil.goPage(RouteName, params);
    }
  }
  getItem(menu) {
    
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR);
  }
  render() {
    const content = (
      <View>
        {this.getItem(MORE_MENU.Tutorial)}
        <View style={GlobalStyles.line} />
        {this.getItem(MORE_MENU.About_Author)}
        <View style={GlobalStyles.line} />
        {this.getItem(MORE_MENU.Feedback)}
      </View>
    );
    return this.aboutCommon.render(content, this.state.data.app);
  }
}

const mapStateToProps = state => ({
  theme: state.theme.theme,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AboutPage);
