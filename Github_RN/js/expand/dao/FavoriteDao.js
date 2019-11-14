import {AsyncStorage} from 'react-native';

const FAVORITE_KEY_PREFIX = 'favorite_';
export default class FavoriteDao {
  constructor(flag) {
    this.favoriteKey = FAVORITE_KEY_PREFIX + flag;
  }
  saveFavoriteItem(key, value, callback) {
    AsyncStorage.setItem(key, value, (error, result) => {
      if (!error) {
        this.updateFavoriteKeys(key, true);
      }
    });
  }
  /**
   * 更新Favorite key集合
   * @param {*} key
   * @param {*} isAdd
   */
  updateFavoriteKeys(key, isAdd) {
    AsyncStorage.getItem(this.favoriteKey, (error, result) => {
      if (!error) {
        let favoriteKeys = [];
        if (result) {
          favoriteKeys = JSON.parse(result);
        }
        let index = favoriteKeys.indexOf(key);
        if (isAdd) {
          if (index === 1) favoriteKeys.push(key);
        } else {
          if (index !== -1) favoriteKeys.splice(index, 1);
        }
        AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys)); //将更新数据保存到数据库
      }
    });
  }
  /**
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
        this.updateFavoriteKeys(key, false);
      }
    });
  }
}
