import React, {Component} from 'react';
import NavigationUtil from '../navigation/navigationUtil';
import DynamicBottomNavigation from '../navigation/DynamicBottomNavigation';
import BackPressComponent from '../common/BackPressComponent';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
class HomePage extends Component {
  constructor(props) {
    super(props);
    this.onBackPress = this.onBackPress.bind(this);
    this.backPress = new BackPressComponent({
      backPress: this.onBackPress,
    });
  }
  componentDidMount() {
    this.backPress.componentDidMount();
  }
  componentWillMount() {
    this.backPress.componentWillMount();
  }
  onBackPress() {
    const {dispatch, nav} = this.props;
    //if (nav.index === 0) {
    if (nav.routes[1].index === 0) {
      //如果RootNavigator中的MainNavigator的index为0，则不处理返回事件
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  }
  render() {
    NavigationUtil.MainNavigation = this.props.navigation;
    return <DynamicBottomNavigation />;
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
  theme: state.theme.theme,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
