import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';

export default class BaseItem extends Component {
  static propTypes = {
    projectModel: PropTypes.object,
    onSelect: PropTypes.func,
    onFavorite: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      isFavorite: this.props.projectModel.isFavorite,
    };
  }
  /**
   * 通过props 改变更新state
   *
   * @static
   * @param {*} nextProps
   * @param {*} prevState
   * @returns
   * @memberof BaseItem
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    const isFavorite = nextProps.projectModel.isFavorite;
    if (prevState.isFavorite !== isFavorite) {
      return {
        isFavorite: isFavorite,
      };
    }
    return null;
  }
  setFavoriteState(isFavorite) {
    //改变传入数据收藏项目的状态
    this.props.projectModel.isFavorite = isFavorite;
    this.setState({
      isFavorite,
    });
  }
  onItemClick() {
    this.props.onSelect(isFavorite => {
      this.setFavoriteState(isFavorite);
    });
  }
  /**
   * 点击收藏图标回调
   *
   * @memberof BaseItem
   */
  onPressFavorite() {
    this.setFavoriteState(!this.state.isFavorite);
    this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite);
  }
  _favoriteIcon() {
    const {theme} = this.props;
    return (
      <TouchableOpacity
        style={styles.baseTouch}
        underlayColor="transparent"
        onPress={() => this.onPressFavorite()}>
        <FontAwesome
          name={this.state.isFavorite ? 'star' : 'star-o'}
          size={26}
          style={{color: theme}}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  baseTouch: {
    padding: 6,
  },
});
