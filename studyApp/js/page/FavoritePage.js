import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';

export default class FavoritePage extends Component {
  render() {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.title}>FavoritePage</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    color: 'red',
  },
});
