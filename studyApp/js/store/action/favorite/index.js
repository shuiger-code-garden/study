import {
  FAVORITE_LOAD_SUCCESS,
  FAVORITE_LOAD_FAIL,
  FAVORITE_LOAD_REFRESH,
} from '../types';
import {FLAG_STORAGE} from '../../../expand/deo/DataStore';
import {handleData, _projectModels} from '../ActionUtil';

/**
 *获取最热数据的异步action
 *
 * @export
 * @param {*} storeName
 * @param {*} url
 * @param {*} pageSize
 * @returns
 */
export function onRefreshPopular(storeName, url, pageSize, favoriteDao) {
  return dispatch => {
    dispatch({type: POPULAR_REFRESH, storeName});
    let dataStore = new DataStore();
    dataStore
      .fetchData(url, FLAG_STORAGE.flag_popular)
      .then(data => {
        handleData(
          POPULAR_REFRESH_SUCCESS,
          dispatch,
          storeName,
          data,
          pageSize,
          favoriteDao,
        );
      })
      .catch(error => {
        console.log(error);
        dispatch({
          type: POPULAR_REFRESH_FAIL,
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
export function onLoadMorePopular(
  storeName,
  pageIndex,
  pageSize,
  dataArray = [],
  callback,
  favoriteDao,
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
          type: POPULAR_LOAD_MORE_FAIL,
          storeName,
          pageIndex: --pageIndex,
        });
      } else {
        let max =
          pageSize * pageIndex > dataArray.length
            ? dataArray
            : pageSize * pageIndex;
        _projectModels(dataArray.slice(0, max), favoriteDao, projectModels => {
          dispatch({
            type: POPULAR_LOAD_MORE_SUCCESS,
            storeName,
            pageIndex: ++pageIndex,
            projectModels,
          });
        });
      }
    }, 300);
  };
}
