import React, {Component} from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

/**
 *生成View的工具类
 *
 * @export
 * @class ViewUtil
 * @extends {Component}
 */
export default class ViewUtil extends Component {
  /**
   * 获取导航左边返回按钮
   *
   * @static
   * @param {*} callBack
   * @returns
   * @memberof ViewUtil
   */
  static getLeftBackButton(callBack) {
    return (
      <TouchableOpacity style={styles.leftBtn} onPress={callBack}>
        <Ionicons
          name={'ios-arrow-back'}
          size={26}
          style={styles.leftBtnIcon}
        />
      </TouchableOpacity>
    );
  }
  /**
   *获取右侧文字按钮
   *
   * @static
   * @param {*} title
   * @param {*} callBack
   * @returns
   * @memberof ViewUtil
   */
  static getRightButton(title, callBack) {
    return (
      <TouchableOpacity style={styles.rightBtn} onPress={callBack}>
        <Text style={styles.rightBtnText}>{title}</Text>
      </TouchableOpacity>
    );
  }
  static getShareButton(callBack) {
    return (
      <TouchableOpacity
        underlayColor={'transparent'}
        onPress={callBack}>
        <Ionicons name={'md-share'} size={20} style={styles.shareIcon} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  leftBtn: {
    padding: 8,
    paddingLeft: 12,
  },
  leftBtnIcon: {
    color: '#fff',
  },
  rightBtn: {
    alignItems: 'center',
  },
  rightBtnText: {
    fontSize: 20,
    color: '#FFFFFF',
    marginRight: 10,
  },
  shareIcon: {
    opacity: 0.9,
    marginRight: 10,
    color: 'white',
  },
});
