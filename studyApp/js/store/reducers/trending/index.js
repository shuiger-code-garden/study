import {
  TRENDING_REFRESH,
  TRENDING_REFRESH_FAIL,
  TRENDING_REFRESH_SUCCESS,
  TRENDING_LOAD_MORE_SUCCESS,
  TRENDING_LOAD_MORE_FAIL,
} from '../../action/types';

const defaultState = {};

/**
 *popular:{
 *     java:{
 *         items:[],
 *         isLoading:false
 *     },
 *     ios:{
 *         items:[],
 *         isLoading:false
 *     }
 * }
 *
 * @export
 * @param {*} [state=defaultState]
 * @param {*} action
 * @returns
 */
export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case TRENDING_REFRESH_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          items: action.items, //所有的数据
          projectModels: action.projectModels, // 获取当前加载数据
          isLoading: false,
          hideLoadingMore: false,
          pageIndex: action.pageIndex,
        },
      };

    case TRENDING_REFRESH:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: true,
          hideLoadingMore: true,
        },
      };
    case TRENDING_REFRESH_FAIL:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: false,
        },
      };

    case TRENDING_LOAD_MORE_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          projectModels: action.projectModels, // 获取当前加载数据
          hideLoadingMore: false,
          pageIndex: action.pageIndex,
        },
      };

    case TRENDING_LOAD_MORE_FAIL:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          hideLoadingMore: true,
          pageIndex: action.pageIndex,
        },
      };

    default:
      return state;
  }
}
