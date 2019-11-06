import Types from '../types';
import DataStore from '../../expand/dao/DataStore';
/**
 * 获取最热数据的异步action
 * @param {*} theme
 */
export function onLoadPopularData(storeName, url, pageSize) {
  //storeName 分类名称 Java/android/ios
  return dispatch => {
    dispatch({type: Types.POPULAR_REFRESH, storeName});
    let dataStore = new DataStore();
    //异步action与数据流
    dataStore
      .fetchData(url)
      .then(data => {
        handlerData(dispatch, storeName, data, pageSize);
      })
      .catch(error => {
        console.log(error);
        dispatch({type: Types.LOAD_POPULAR_FAIL, storeName, error});
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
  callBack,
) {}
function handlerData(dispatch, storeName, data) {
  dispatch({
    type: Types.LOAD_POPULAR_SUCCESS,
    items: data && data.data && data.data.items,
    storeName,
  });
}
