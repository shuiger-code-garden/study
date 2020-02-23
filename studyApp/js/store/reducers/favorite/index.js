import {
  FAVORITE_LOAD_SUCCESS,
  FAVORITE_LOAD_FAIL,
  FAVORITE_LOAD_REFRESH,
} from '../../action/types';
const defaultState = {};

/**
 *popular:{
 *     popular:{
 *         projectModels:[],
 *         isLoading:false
 *     },
 *     favorite:{
 *         projectModels:[],
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
    case FAVORITE_LOAD_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          projectModels: action.projectModels, // 获取当前加载数据
          isLoading: false,
        },
      };

    case FAVORITE_LOAD_REFRESH:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: true,
        },
      };
    case FAVORITE_LOAD_FAIL:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: false,
          error: action.error,
        },
      };

    default:
      return state;
  }
}
