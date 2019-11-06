import {AsyncStorage} from 'react-native';
export default class DataStore {
  /**保存数据 */
  saveData(url, data, callback) {
    if (!data || !url) return;
    AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback);
  }
  /**数据添加时间戳 */
  _wrapData(data) {
    return {data: data, timestamp: new Date().getTime()};
  }
  /**获取本地数据 */
  fetchLocalData(url) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(url, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(e);
            console.log(e);
          }
        } else {
          reject(error);
          console.error(error);
        }
      });
    });
  }
  /**获取网络数据 */
  fetchNetData(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Network response was not ok.');
        })
        .then(responseData => {
          this.saveData(url, responseData);
          resolve(responseData);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  /**入口方法 离线缓存策略思想 */
  fetchData(url) {
    return new Promise((resolve, reject) => {
      //先从本地获取数据
      this.fetchLocalData(url)
        .then(wrapData => {
          if (wrapData && DataStore.checkTimestampValid(wrapData.timestamp)) {
            resolve(wrapData);
          } else {
            //本地数据不存在或过时，请求网络数据
            this.fetchNetData(url)
              .then(data => {
                resolve(this._wrapData(data));
              })
              .catch(error => {
                reject(error);
              });
          }
        })
        .catch(error => {
          //本地获取数据失败后，请求网络数据
          this.fetchNetData(url)
            .then(data => {
              resolve(this._wrapData(data));
            })
            .catch(error => {
              reject(error);
            });
        });
    });
  }
  /**数据有效性检查 */
  static checkTimestampValid(timestamp) {
    const currentDate = new Date();
    const targetDate = new Date();
    targetDate.setTime(timestamp);
    if (currentDate.getMonth() !== targetDate.getMonth()) return false;
    if (currentDate.getDate() !== targetDate.getDate()) return false;
    if (currentDate.getHours() - targetDate.getHours() > 4) return false;
    return true;
  }
}
