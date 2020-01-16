import {
  TRENDING_REFRESH,
  TRENDING_REFRESH_FAIL,
  TRENDING_REFRESH_SUCCESS,
  TRENDING_LOAD_MORE_SUCCESS,
  TRENDING_LOAD_MORE_FAIL,
} from '../types';
import DataStore, {FLAG_STORAGE} from '../../../expand/deo/DataStore';
import {handleData} from '../actionUtil';

/**
 *获取最热数据的异步action
 *
 * @export
 * @param {*} storeName
 * @param {*} url
 * @param {*} pageSize
 * @returns
 */
export function onRefreshTrending(storeName, url, pageSize) {
  return dispatch => {
    dispatch({type: TRENDING_REFRESH, storeName});
    let dataStore = new DataStore();
    dataStore
      .fetchData(url, FLAG_STORAGE.flag_trending)
      .then(data => {
        handleData(
          TRENDING_REFRESH_SUCCESS,
          dispatch,
          storeName,
          data,
          pageSize,
        );
      })
      .catch(error => {
        console.log(error);
        dispatch({
          type: TRENDING_REFRESH_FAIL,
          storeName,
          error,
        });
      });
  };
}

/**
 * 上拉加载更多数据异步action
 *
 * @export
 * @param {*} storeName
 * @param {*} pageIndex
 * @param {*} pageSize
 * @param {*} [dataArray=[]]
 * @param {*} callback
 * @returns
 */
export function onLoadMoreTrending(
  storeName,
  pageIndex,
  pageSize,
  dataArray = [],
  callback,
) {
  return dispatch => {
    setTimeout(() => {
      // 在获取当前页面数据之前判断上一页是否加载完所有数据
      if ((pageIndex - 1) * pageSize >= dataArray.length) {
        if (typeof callback === 'function') {
          callback('no more');
        }
        dispatch({
          error: 'no more',
          type: TRENDING_LOAD_MORE_FAIL,
          storeName,
          pageIndex: --pageIndex,
        });
        // console.log('TRENDING_LOAD_MORE_FAIL');
      } else {
        let max =
          pageSize * pageIndex > dataArray.length
            ? dataArray
            : pageSize * pageIndex;
        let projectModels = dataArray.slice(0, max);
        console.log(projectModels, 'SUCCESS');
        dispatch({
          type: TRENDING_LOAD_MORE_SUCCESS,
          storeName,
          pageIndex: ++pageIndex,
          projectModels,
        });
      }
    }, 300);
  };
}
