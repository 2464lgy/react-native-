import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore';
import {handlerData, _projectModels} from '../ActionUtil';
import FavoriteDao from '../../expand/dao/FavoriteDao';
import ProjectModel from '../../model/ProjectModel';
/**
 * 加载收藏的项目
 * @param {*} flag
 * @param {*} isShowLoading
 */
export function onLoadFavoriteData(flag, isShowLoading) {
  return dispatch => {
    dispatch({type: Types.FAVORITE_LOAD_DATA, storeName: flag});
    new FavoriteDao(flag)
      .getAllItems()
      .then(items => {
        let resultData = [];
        for (let i = 0, len = items.length; i < len; i++) {
          resultData.push(new ProjectModel(items[i], true));
        }
        dispatch({
          type: Types.FAVORITE_LOAD_SUCCESS,
          projectModels: resultData,
          storeName: flag,
        });
      })
      .catch(err => {
        console.log(err);
        dispatch({type: Types.FAVORITE_LOAD_FAIL, error: err, storeName: flag});
      });
  };
}
