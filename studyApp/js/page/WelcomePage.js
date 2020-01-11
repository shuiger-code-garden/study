import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import NavigationUtil from '../navigation/navigationUtil';

export default class WelcomePage extends Component {
  componentDidMount() {
    this.timeId = setTimeout(() => {
      NavigationUtil.goHomePage({
        params: {
          navigation: this.props.navigation,
        },
      });
    }, 2000);
  }
  componentWillUnmount() {
    clearTimeout(this.timeId);
  }
  render() {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.title}>Welcome</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    color: '#000',
  },
});
