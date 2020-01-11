import React, {Component} from 'react';
import NavigationUtil from '../navigation/navigationUtil';
import DynamicBottomNavigation from '../navigation/DynamicBottomNavigation';

export default class HomePage extends Component {
  render() {
    NavigationUtil.MainNavigation = this.props.navigation;
    return <DynamicBottomNavigation />;
  }
}
