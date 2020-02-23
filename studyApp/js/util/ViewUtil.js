import React, {Component} from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
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
   *
   * 获取设置页的Item
   * @static
   * @param {*} callBack
   * @param {*} text
   * @param {*} color
   * @param {*} Icons
   * @param {*} icon
   * @param {*} expandableIco
   * @returns
   * @memberof ViewUtil
   */
  static getSettingItem(callBack, text, color, Icons, icon, expandableIco) {
    return (
      <TouchableOpacity
        onPress={callBack}
        style={styles.setting_item_container}>
        <View>
          {Icons && icon ? (
            <Icons
              name={icon}
              size={16}
              style={{color: color, marginRight: 10}}
            />
          ) : (
            <View style={styles.iconView} />
          )}
          <Text>{text}</Text>
        </View>
        <Ionicons
          name={expandableIco ? expandableIco : 'ios-arrow-forward'}
          size={16}
          style={{
            marginRight: 10,
            alignSelf: 'center',
            color: color || 'black',
          }}
        />
      </TouchableOpacity>
    );
  }
  /**
   *
   *  处理设置页的Item的参数
   * @static
   * @param {*} callBack
   * @param {*} menu
   * @param {*} color
   * @param {*} expandableIco
   * @returns
   * @memberof ViewUtil
   */
  static getMenuItem(callBack, menu, color, expandableIco) {
    return ViewUtil.getSettingItem(
      callBack,
      menu.name,
      color,
      menu.Icons,
      menu.icon,
      expandableIco,
    );
  }

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
      <TouchableOpacity underlayColor={'transparent'} onPress={callBack}>
        <Ionicons name={'md-share'} size={20} style={styles.shareIcon} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  iconView: {opacity: 1, width: 16, height: 16, marginRight: 10},
  setting_item_container: {
    backgroundColor: '#fff',
    padding: 10,
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
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
