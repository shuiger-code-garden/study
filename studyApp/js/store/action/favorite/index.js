import {
  FAVORITE_LOAD_SUCCESS,
  FAVORITE_LOAD_FAIL,
  FAVORITE_LOAD_REFRESH,
} from '../types';
import FavoriteDao from '../../../expand/deo/FavoriteDao';
import {ProjectModel} from '../../../model/projectModel';

/**
 *
 *
 * @export
 * @param {*} flag
 * @param {*} isShowLoading
 * @returns
 */
export function onLoadFavoriteData(flag, isShowLoading) {
  return dispatch => {
    if (isShowLoading) {
      dispatch({
        type: FAVORITE_LOAD_REFRESH,
        storeName: flag,
      });
    }

    new FavoriteDao(flag)
      .getAllItems()
      .then(items => {
        let resultData = [];
        for (let i = 0, len = items.length; i < len; i++) {
          resultData.push(new ProjectModel(items[i], true));
        }
        dispatch({
          type: FAVORITE_LOAD_SUCCESS,
          projectModels: resultData,
          storeName: flag,
        });
      })
      .catch(e => {
        console.log(e);
        dispatch({
          type: FAVORITE_LOAD_FAIL,
          error: e,
          storeName: flag,
        });
      });
  };
}
