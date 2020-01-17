import AsyncStorage from '@react-native-community/async-storage';
import GitHubTrending from 'GitHubTrending';
import Storage from '../storage';

export const FLAG_STORAGE = {
  flag_popular: 'popular',
  flag_trending: 'trending',
};

export default class DataStore {
  /**
   *  获取数据，优先获取本地数据，如果无本地数据或本地数据过期则获取网络数据
   *
   * @param {*} url
   * @param {*} flag
   * @returns
   * @memberof DataStore
   */
  fetchData(url, flag) {
    return new Promise((resolve, reject) => {
      this.fetchLocalData(url)
        .then(wrapData => {
          if (wrapData && DataStore.checkTimestampValid(wrapData.timestamp)) {
            resolve(wrapData);
          } else {
            this.fetchNetData(url, flag)
              .then(data => {
                resolve(this._wrapData(data));
              })
              .catch(error => {
                reject(error);
              });
          }
        })
        .catch(error => {
          this.fetchNetData(url, flag)
            .then(data => {
              resolve(this._wrapData(data));
            })
            .catch(error => {
              reject(error);
            });
        });
    });
  }

  /**
   * 获取本地数据
   *
   * @param {*} url
   * @memberof DataStore
   */
  fetchLocalData(url) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(url, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(e);
            console.error(e);
          }
        } else {
          reject(error);
          console.error(error);
        }
      });
    });
  }

  /**
   *获取网络数据
   *
   * @param {*} url
   * @param {*} flag
   * @returns
   * @memberof DataStore
   */
  fetchNetData(url, flag) {
    return new Promise((resolve, reject) => {
      if (flag !== FLAG_STORAGE.flag_trending) {
        fetch(url)
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Network response was not ok');
          })
          .then(responseData => {
            this.saveData(url, responseData);
            resolve(responseData);
          })
          .catch(error => {
            reject(error);
          });
      } else {
        new GitHubTrending()
          .fetchTrending(url)
          .then(items => {
            if (!items) {
              throw new Error('responseData is null');
            }
            this.saveData(url, items);
            resolve(items);
          })
          .catch(error => {
            reject(error);
          });
      }
    });
  }

  /**
   *保存数据
   *
   * @param {*} url
   * @param {*} data
   * @param {*} callback
   * @returns
   * @memberof DataStore
   */
  saveData(url, data, callback) {
    if (!url || !data) return;
    AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback);
  }

  /**
   *封装要保存的数据
   *
   * @param {*} data
   * @returns
   * @memberof DataStore
   */
  _wrapData(data) {
    return {
      data,
      timestamp: new Date().getTime(),
    };
  }

  /**
   *
   *  检查timestamp是否在有效期内
   * @static
   * @param {*} timestamp 项目更新时间
   * @memberof DataStore
   * @return {boolean} true 不需要更新,false需要更新
   */
  static checkTimestampValid(timestamp) {
    const currentDate = new Date();
    const targetDate = new Date(timestamp); // 通过毫秒设置时间
    targetDate.setTime(timestamp);
    if (currentDate.getMonth() !== targetDate.getMonth()) return false;
    if (currentDate.getDate() !== targetDate.getDate()) return false;
    if (currentDate.getHours() - targetDate.getHours() > 4) return false;
    return true;
  }
}
