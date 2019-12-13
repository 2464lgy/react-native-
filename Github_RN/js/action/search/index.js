import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore';
import {handlerData, _projectModels} from '../ActionUtil';
/**
 *
 * @param {*} inputKey
 * @param {*} pageSize
 * @param {*} token
 * @param {*} favoriteDao
 * @param {*} popularkeys
 * @param {*} callBack
 */
export function onSearch(
  inputKey,
  pageSize,
  token,
  favoriteDao,
  popularkeys,
  callBack,
) {
  return dispatch => {
    dispatch({type: Types.SEARCH_REFRESH});
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
function genFetchUrl(key) {}
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

/**
 *刷新收藏状态
 * @param {*} storeName
 * @param {*} pageIndex
 * @param {*} pageSize
 * @param {*} dataArray
 * @param {*} favoriteDao
 */
export function onFlushPopularFavorite(
  storeName,
  pageIndex,
  pageSize,
  dataArray = [],
  favoriteDao,
) {
  return dispatch => {
    let max =
      pageSize * pageIndex > dataArray.length
        ? dataArray.length
        : pageSize * pageIndex;
    _projectModels(dataArray.slice(0, max), favoriteDao, data => {
      dispatch({
        type: Types.FLUSH_POPULAR_FAVORITE,
        storeName,
        pageIndex,
        projectModels: data,
      });
    });
  };
}
