/**
 *
 * 数据处理成功
 * @export
 * @param {*} actionType
 * @param {*} dispatch
 * @param {*} storName
 * @param {*} data
 * @param {*} pageSize
 */
export function handleData(actionType, dispatch, storeName, data, pageSize) {
  let fixItems = [];
  if (data && data.data) {
    if (Array.isArray(data.data)) {
      fixItems = data.data;
    } else if (Array.isArray(data.data.items)) {
      fixItems = data.data.items;
    }
  }
  let projectModels =
    pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize);

  dispatch({
    type: actionType,
    storeName,
    projectModels,
    items: fixItems,
    pageIndex: 1,
  });
}
