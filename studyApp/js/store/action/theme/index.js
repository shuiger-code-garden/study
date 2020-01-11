import {THEME_COLOR_CHANGE} from '../types';

export function onThemeColorChange(value) {
  return {
    type: THEME_COLOR_CHANGE,
    theme: value,
  };
}
