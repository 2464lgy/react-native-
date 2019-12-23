import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore';
import {handlerData, _projectModels, doCallBack} from '../ActionUtil';
import ArrayUtil from '../../util/ArrayUtil';
import Utils from '../../util/Utils';

const API_URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=starts';
//保存取消的所有的key
const CANCEL_TOKENS = [];
/**
 *
 * @param {*} inputKey
 * @param {*} pageSize
 * @param {*} token 与搜索关联的唯一token，可以通过token取消搜索
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
    let url = genFetchUrl(inputKey);
    fetch(url)
      .then(response => {
        //如果任务取消，则不做任何处理
        return hasCancel(token) ? null : response.json();
      })
      .then(responseData => {
        if (hasCancel(token, true)) {
          //如果任务取消，则不做任何处理
          console.log('user cancel');
          return;
        }
        if (
          !responseData ||
          !responseData.items ||
          responseData.items.length === 0
        ) {
          dispatch({
            type: Types.SEARCH_FAIL,
            message: `没找到关于${inputKey}的项目`,
          });
          doCallBack(callBack, `没找到关于${inputKey}的项目`);
          return;
        }
        let items = responseData.items;
        handlerData(
          Types.SEARCH_REFRESH_SUCCESS,
          dispatch,
          '',
          {data: items},
          pageSize,
          favoriteDao,
          {
            showBottomButton: !Utils.checkKeyIsExist(popularkeys, inputKey), //判断inputkey是否已经包含在popularkeys里面
            inputKey,
          },
        );
      })
      .catch(err => {
        console.log(err);
        dispatch({type: Types.SEARCH_FAIL, error: err});
      });
  };
}
//生成url
function genFetchUrl(key) {
  return API_URL + key + QUERY_STR;
}
function hasCancel(token, isRemove) {
  if (CANCEL_TOKENS.includes(token)) {
    isRemove && ArrayUtil.remove(CANCEL_TOKENS, token);
    return true;
  }
  return false;
}

//取消一个异步任务
export function onSearchCancel(token) {
  return dispatch => {
    CANCEL_TOKENS.push(token);
    dispatch({type: Types.SEARCH_CANCEL});
  };
}
/**
 * 加载更多
 * @param {*} dispatch
 * @param {*} storeName
 * @param {*} data
 */
export function onLoadMoreSearch(
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
          type: Types.SEARCH_LOAD_MORE_FAIL,
          error: 'no more',
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
            type: Types.SEARCH_LOAD_MORE_SUCCESS,
            pageIndex,
            projectModels: data,
          });
        });
      }
    }, 500);
  };
}
