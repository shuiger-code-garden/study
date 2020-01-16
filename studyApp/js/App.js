import React, {Component} from 'react';
import {Provider} from 'react-redux';
import store from './store';
import AppNavigator from './navigation/AppNavigation';
import {Provider as UIProvider} from '@ant-design/react-native';
export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <UIProvider>
          <AppNavigator />
        </UIProvider>
      </Provider>
    );
  }
}
