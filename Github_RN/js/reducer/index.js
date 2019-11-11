import {combineReducers} from 'redux';
import theme from './theme';
import popular from './popular';
import trending from './trending';
/**
 * 1合并reducer
 */
const index = combineReducers({
  theme,
  popular,
  trending,
}); //reducer的聚合
export default index;
