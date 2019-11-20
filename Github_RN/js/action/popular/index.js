import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore';
import {handlerData, _projectModels} from '../ActionUtil';
/**
 * 获取最热数据的异步action
 * @param {*} theme
 */
export function onRefreshPopular(storeName, url, pageSize, favoriteDao) {
  //storeName 分类名称 Java/android/ios
  return dispatch => {
    dispatch({type: Types.POPULAR_REFRESH, storeName});
    let dataStore = new DataStore();
    //异步action与数据流
    dataStore
      .fetchData(url, FLAG_STORAGE.flag_popular)
      .then(data => {
        handlerData(
          Types.POPULAR_REFRESH_SUCCESS,
          dispatch,
          storeName,
          data,
          pageSize,
          favoriteDao,
        );
      })
      .catch(error => {
        console.log(error);
        dispatch({type: Types.POPULAR_REFRESH_FAIL, storeName, error});
      });
  };
}
/**
 * 加载更多
 * @param {*} dispatch
 * @param {*} storeName
 * @param {*} data
 */
export function onLoadMorePopular(
  storeName,
  pageIndex,
  pageSize,
  dataArray = [],
  favoriteDao,
  callBack,
) {
  return dispatch => {
    setTimeout(() => {
      //模拟网络请求
      if ((pageIndex - 1) * pageSize >= dataArray.length) {
        if (typeof callBack === 'function') {
          callBack('no more');
        }
        //已经加载完全部数据
        dispatch({
          type: Types.POPULAR_LOAD_MORE_FAIL,
          error: 'no more',
          storeName,
          pageIndex: --pageIndex,
        });
      } else {
        //本次可载入的最大数据量
        let max =
          pageSize * pageIndex > dataArray.length
            ? dataArray.length
            : pageSize * pageIndex;
        _projectModels(dataArray.slice(0, max), favoriteDao, data => {
          dispatch({
            type: Types.POPULAR_LOAD_MORE_SUCCESS,
            storeName,
            pageIndex,
            projectModels: data,
          });
        });
      }
    }, 500);
  };
}
