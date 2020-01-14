import React, {Component} from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Platform,
  DeviceInfo,
  ImageBackground,
} from 'react-native';
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
        visible={this.props.visible}
        transparent={true}
        animationType={'slide'}
        onRequestClose={onClose()}>
        <TouchableOpacity
          style={styles.container}
          onPress={() => this.dismiss()}>
          <MaterialIcons
            name={'arrow-drop-up'}
            size={36}
            style={styles.arrow}
          />

          
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
});
