import Types from '../../action/types';
import ThemeFactory, {ThemeFlags} from '../../res/styles/ThemeFactory';
const defaultState = {
  theme: ThemeFactory.createTheme(ThemeFlags.Default),
  onShowCustomThemeView: false,
};
export default function onAction(state = defaultState, action) {
  //这里不能修改state，只能返回一个新的对象，或直接返回原始的state
  switch (action.type) {
    case Types.THEME_CHANGE:
      return {
        ...state,
        theme: action.theme,
      };
    case Types.SHOW_THEME_VIEW:
      return {
        ...state,
        customThemeViewVisible: action.customThemeViewVisible,
      };
    default:
      return state;
  }
}
