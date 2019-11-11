import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore';
import {handlerData} from '../ActionUtil';
/**
 * 获取最热数据的异步action
 * @param {*} theme
 */
export function onRefreshTrending(storeName, url, pageSize) {
  //storeName 分类名称 Java/android/ios
  return dispatch => {
    dispatch({type: Types.TRENDING_REFRESH, storeName});
    let dataStore = new DataStore();
    //异步action与数据流
    dataStore
      .fetchData(url, FLAG_STORAGE.flag_trending)
      .then(data => {
        handlerData(
          Types.TRENDING_REFRESH_SUCCESS,
          dispatch,
          storeName,
          data,
          pageSize,
        );
      })
      .catch(error => {
        console.log(error);
        dispatch({type: Types.TRENDING_REFRESH_FAIL, storeName, error});
      });
  };
}
/**
 * 加载更多
 * @param {*} dispatch
 * @param {*} storeName
 * @param {*} data
 */
export function onLoadMoreTrending(
  storeName,
  pageIndex,
  pageSize,
  dataArray = [],
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
          type: Types.TRENDING_LOAD_MORE_FAIL,
          error: 'no more',
          storeName,
          pageIndex: --pageIndex,
          projectModes: dataArray,
        });
      } else {
        //本次可载入的最大数据量
        let max =
          pageSize * pageIndex > dataArray.length
            ? dataArray.length
            : pageSize * pageIndex;
        dispatch({
          type: Types.TRENDING_LOAD_MORE_SUCCESS,
          storeName,
          pageIndex,
          projectModes: dataArray.slice(0, max),
        });
      }
    }, 500);
  };
}
