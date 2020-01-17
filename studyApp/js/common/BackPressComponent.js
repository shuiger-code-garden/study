import React from 'react';
import {BackHandler} from 'react-native';

/**
 * 封装一个监听安卓手机返回按钮事件回调机制
 *
 * @export
 * @class BackHandlerComponent
 */
export default class BackHandlerComponent {
  constructor(props) {
    this.props = props;
    this._onHardwareBackPress = this.onHardwareBackPress.bind(this);
  }
  componentDidMount() {
    //在类方法componentDidMount 订阅安卓返回监听机制
    if (this.props.backPress)
      BackHandler.addEventListener(
        'hardwareBackPress',
        this._onHardwareBackPress,
      );
  }
  componentWillUnmount() {
    //componentWillMount 移除安卓返回监听机制
    if (this.props.backPress)
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this._onHardwareBackPress,
      );
  }
  onHardwareBackPress(e) {
    return this.props.backPress(e);
  }
}
