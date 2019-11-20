import {AsyncStorage} from 'react-native';

const FAVORITE_KEY_PREFIX = 'favorite_';
export default class FavoriteDao {
  constructor(flag) {
    //flag用于标识区分（最热模块和趋势模块）
    this.favoriteKey = FAVORITE_KEY_PREFIX + flag;
  }
  /**
   * 收藏项目，保存收藏的项目
   * @param {*} key
   * @param {*} value
   * @param {*} callback
   */
  saveFavoriteItem(key, value, callback) {
    AsyncStorage.setItem(key, value, (error, result) => {
      if (!error) {
        //更新Favorite的key
        this.updateFavoriteKeys(key, true);
      }
    });
  }
  /**
   * 更新Favorite key集合
   * @param {*} key
   * @param {*} isAdd true 添加  false 删除
   */
  updateFavoriteKeys(key, isAdd) {
    AsyncStorage.getItem(this.favoriteKey, (error, result) => {
      if (!error) {
        let favoriteKeys = [];
        if (result) {
          favoriteKeys = JSON.parse(result);
        }
        let index = favoriteKeys.indexOf(key); //查看key是否存在于数组中
        if (isAdd) {
          //添加
          if (index === -1) favoriteKeys.push(key); //添加时，如果不存在，将key保存到favoriteKeys中
        } else {
          //删除
          if (index !== -1) favoriteKeys.splice(index, 1); //删除时，如果存在，将key从favoriteKeys中删除
        }
        AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys)); //将更新数据保存到数据库
      }
    });
  }
  /**
   * 添加新的收藏后，需要刷新页面，到新的收藏状态
   * 获取收藏的Repository对应的key
   */
  getFavoriteKeys() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.favoriteKey, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(error);
          }
        } else {
          reject(error);
        }
      });
    });
  }
  /**
   * 取消收藏，移除已经收藏的项目
   * @param {*} key
   */
  removeFavoriteItem(key) {
    AsyncStorage.removeItem(key, (error, result) => {
      if (!error) {
        this.updateFavoriteKeys(key, false); //更新数组，删除key
      }
    });
  }
  //获取所有收藏的项目
  getAllItems() {
    return new Promise((resolve, reject) => {
      this.getFavoriteKeys()
        .then(keys => {
          let items = [];
          if (keys) {
            AsyncStorage.multiGet(keys, (_err, stores) => {
              try {
                stores.map((result, i, store) => {
                  let key = store[i][0];
                  let value = store[i][1];
                  if (value) items.push(JSON.parse(value));
                });
                resolve(items);
              } catch (e) {
                reject(e);
              }
            });
          } else {
            resolve(items);
          }
        })
        .catch(e => {
          reject(e);
        });
    });
  }
}
