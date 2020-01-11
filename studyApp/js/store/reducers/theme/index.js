import {THEME_INIT, THEME_COLOR_CHANGE} from '../../action/types';

const defaultState = {
  theme: 'blue',
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case THEME_INIT:
      return {
        ...state,
      };
    case THEME_COLOR_CHANGE:
      return {
        theme: action.theme,
      };

    default:
      return {
        ...state,
      };
  }
}
