import {ProjectModel} from '../../model/projectModel';
import Util from '../../util/Utils';
/**
 *
 *
 * @export
 * @param {*} actionType
 * @param {*} dispatch
 * @param {*} storeName
 * @param {*} data
 * @param {*} pageSize
 * @param {*} favoriteDao
 */
export function handleData(
  actionType,
  dispatch,
  storeName,
  data,
  pageSize,
  favoriteDao,
) {
  let fixItems = [];

  if (data && data.data) {
    if (Array.isArray(data.data)) {
      fixItems = data.data;
    } else if (Array.isArray(data.data.items)) {
      fixItems = data.data.items;
    }
  }
  let showItems =
    pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize);
  // _projectModels是异步函数需要借助回调函数
  _projectModels(showItems, favoriteDao, projectModels => {
    dispatch({
      type: actionType,
      storeName: storeName,
      projectModels: projectModels,
      items: fixItems,
      pageIndex: 1,
    });
  });
}

/**
 *
 * 检查项目是否被收藏，进行封装
 * @export
 * @param {*} showItems
 * @param {*} favoriteDao
 * @param {*} callback
 */
export async function _projectModels(showItems, favoriteDao, callback) {
  let keys = [];
  try {
    keys = await favoriteDao.getFavoriteKeys();
  } catch (error) {
    console.log(error);
  }
  let projectModels = [];
  for (let i = 0, len = showItems.length; i < len; ++i) {
    projectModels.push(
      new ProjectModel(showItems[i], Util.checkFavorite(showItems[i], keys)),
    );
  }
  doCallback(projectModels, callback);
}
/**
 *
 *
 * @export
 * @param {*} projectModels
 * @param {*} callback
 */
export function doCallback(projectModels, callback) {
  if (typeof callback === 'function') {
    callback(projectModels);
  }
}
