import React, {Component} from 'react';
import {StyleSheet, View, Button} from 'react-native';

export default class DetailPage extends Component {
  handleSetTheme() {
    let {navigation} = this.props;
    navigation.setParams({
      initColor: 'green',
      update: new Date().getTime(),
    });
  }
  render() {
    return (
      <View style={styles.wrapper}>
        <Button
          title="改变主题颜色"
          style={styles.title}
          onPress={() => {
            this.handleSetTheme();
          }}
        />
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
    color: 'red',
  },
});
