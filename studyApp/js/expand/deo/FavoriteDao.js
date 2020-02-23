import AsyncStorage from '@react-native-community/async-storage';
const FAVORITE_KEY_PREFIX = 'favorite_';

/**
 *  通过favoritekey 区分不同页面的项目收藏
 *  saveFavoriteItem -》 收藏项目
 *  updateFavoriteKeys 通过 favoritekey 管理 不同页面的收藏项目的key
 *  getFavoriteKeys 通过 favoritekey 获取不同页面的收藏项目的key
 *  getAllItems 通过key列表获取所有的收藏项目
 *  favoritekey => 管理不同页面的收藏项目的key列表， 通过key值列表获取对应的页面收藏项目
 *
 *
 */

/**
 *保存项目数据处理层
 *
 * @export
 * @class FavoriteDao
 */
export default class FavoriteDao {
  constructor(flag) {
    this.favoritekey = FAVORITE_KEY_PREFIX + flag;
  }
  /**
   *
   *收藏项目,保存收藏的项目
   * @param {*} key
   * @param {*} value
   * @param {*} callback
   * @memberof FavoriteDao
   */
  saveFavoriteItem(key, value, callback) {
    AsyncStorage.setItem(key, JSON.stringify(value), (error, result) => {
      if (!error) {
        this.updateFavoriteKeys(key, true);
      }
    });
  }
  /**
   * 更新Favorite key集合
   * @param key 当前key值
   * @param isAdd true 添加,false 删除
   * **/
  updateFavoriteKeys(key, isAdd) {
    AsyncStorage.getItem(this.favoritekey, (error, result) => {
      if (!error) {
        let favoritekeys = [];
        if (result) {
          // 保存的key值集合
          favoritekeys = JSON.parse(result);
        }
        // 判断当前key值是否存在集合中
        let index = favoritekeys.indexOf(key);
        if (isAdd) {
          if (index === -1) favoritekeys.push(key);
        } else {
          //如果是删除且key存在则将其从数值中移除
          if (index !== -1) favoritekeys.splice(index, 1);
        }
        //将更新后的key集合保存到本地
        AsyncStorage.setItem(this.favoritekey, JSON.stringify(favoritekeys));
      }
    });
  }
  /**
   * 获取收藏的Repository对应的keys列表
   *
   * @memberof FavoriteDao
   */
  getFavoriteKeys() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.favoritekey, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(e);
          }
        } else {
          reject(error);
        }
      });
    });
  }

  /**
   * 取消收藏,移除已经收藏的项目
   * @param key 项目 id
   */

  removeFavoriteItem(key) {
    AsyncStorage.removeItem(key, (error, result) => {
      if (!error) {
        this.updateFavoriteKeys(key, false);
      }
    });
  }

  /**
   * 获取所以收藏的项目
   * @return {Promise}
   */
  getAllItems() {
    return new Promise((resolve, reject) => {
      this.getFavoriteKeys()
        .then(keys => {
          let items = [];
          if (keys) {
            AsyncStorage.multiGet(keys, (err, stores) => {
              try {
                stores.map((result, i, store) => {
                  // get at each store's key/value so you can work with it
                  let key = store[i][0];
                  let value = store[i][1];
                  if (value) items.push(JSON.parse(value));
                });
                resolve(items);
              } catch (e) {
                reject(e);
              }
            });
          } else {
            resolve(items);
          }
        })
        .catch(e => {
          reject(e);
        });
    });
  }
}
