import {AsyncStorage} from 'react-native';

export const FLAG_LANGUAGE = {
  flag_language: 'language_dao_language',
  flag_key: 'language_dao_key',
};
export default class LanguageDao {
  constructor(flag) {
    this.flag = flag;
  }
  fetch() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.flag, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if(!result){
          let data=this.flag===FLAG_LANGUAGE.flag_language?
        }
      });
    });
  }
}
