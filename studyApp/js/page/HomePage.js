import React, {Component} from 'react';
import NavigationUtil from '../navigation/navigationUtil';
import DynamicBottomNavigation from '../navigation/DynamicBottomNavigation';
import BackPressComponent from '../common/BackPressComponent';
import {connect} from 'react-redux';
import {NavigationActions} from 'react-navigation';
import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
class HomePage extends Component {
  constructor(props) {
    super(props);
    this.backPress = new BackPressComponent({backPress: this.onBackPress});
  }
  componentDidMount() {
    this.backPress.componentDidMount();
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }
  onBackPress = () => {
    const {dispatch, nav} = this.props;
    //if (nav.index === 0) {
    if (nav.routes[1].index === 0) {
      //如果RootNavigator中的MainNavigator的index为0，则不处理返回事件
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  };
  render() {
    NavigationUtil.MainNavigation = this.props.navigation;
    return (
      <SafeAreaViewPlus>
        <DynamicBottomNavigation />
      </SafeAreaViewPlus>
    );
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
  theme: state.theme.theme,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
