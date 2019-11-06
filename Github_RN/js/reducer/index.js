import {combineReducers} from 'redux';
import theme from './theme';
import popular from './popular';
/**
 * 1合并reducer
 */
const index = combineReducers({
  theme,
  popular,
}); //reducer的聚合
export default index;
