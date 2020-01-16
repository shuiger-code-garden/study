import React, {Component} from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Platform,
  DeviceInfo,
} from 'react-native';
//Platform模块用于区分移动设备的操作系统及api版本
//

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TimeSpan from '../model/TimeSpan';
export const TimeSpans = [
  new TimeSpan('今 天', 'since=daily'),
  new TimeSpan('本 周', 'since=weekly'),
  new TimeSpan('本 月', 'since=monthly'),
];

export default class TrendingDialog extends Component {
  state = {
    visible: false, //是否显示状态
  };
  /**
   * 显示
   *  @memberof TrendingDialog
   */
  show() {
    this.setState({
      visible: true,
    });
  }
  /**
   * 隐藏
   *
   * @memberof TrendingDialog
   */
  dismiss() {
    this.setState({
      visible: false,
    });
  }

  render() {
    let {onClose, onSelect} = this.props;
    return (
      <Modal
        visible={this.state.visible}
        transparent={true}
        onRequestClose={() => {
          onClose();
          this.dismiss();
        }}>
        <TouchableOpacity
          style={styles.container}
          onPress={() => this.dismiss()}>
          <MaterialIcons
            name={'arrow-drop-up'}
            size={36}
            style={styles.arrow}
          />

          <View style={{backgroundColor: '#fff'}}>
            {TimeSpans.map((result, i, arr) => {
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => onSelect(arr[i])}
                  underlayColor={'transparent'}>
                  <View style={styles.text_container}>
                    <Text style={styles.text}>{arr[i].showText}</Text>
                  </View>
                  {i !== TimeSpans.length - 1 ? (
                    <View style={styles.line} />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
  },
  arrow: {
    marginTop: 40,
    color: 'white',
    padding: 0,
    margin: -15,
  },
  text_container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    color: 'black',
    fontWeight: '400',
    padding: 8,
    paddingLeft: 26,
    paddingRight: 26,
  },
  line: {
    height: 0.3,
    backgroundColor: 'darkgray',
  },
});
