import Types from '../../action/types';
const defaultState = {
  theme: 'blue',
};
export default function onAction(state = defaultState, action) {
  //这里不能修改state，只能返回一个新的对象，或直接返回原始的state
  switch (action.type) {
    case Types.THEME_CHANGE:
      return {
        ...state,
        theme: action.theme,
      };
    default:
      return state;
  }
}
