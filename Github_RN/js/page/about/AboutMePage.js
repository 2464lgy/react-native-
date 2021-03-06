import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  ScrollView,
  Linking,
  Clipboard,
} from 'react-native';
import {connect} from 'react-redux';
import actions from '../../action';
import NavigationUtil from '../../navigator/NavigationUtil';
import {MORE_MENU} from '../../common/MORE_MENU';
import ViewUtil from '../../util/ViewUtil';
import AboutCommon, {FLAG_ABOUT} from './AboutCommon';
import config from '../../res/data/config.json';
import GlobalStyles from '../../res/styles/GlobalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-easy-toast';
export default class AboutMePage extends React.Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.aboutCommon = new AboutCommon(
      {
        ...this.params,
        navigation: this.props.navigation,
        flagAbout: FLAG_ABOUT.flag_about_me,
      },
      data => this.setState({...data}),
    );
    this.state = {
      data: config,
      showTutorial: true,
      showBlog: false,
      showQQ: false,
      showContact: false,
    };
  }
  onClick(tab) {
    if (!tab) return;
    if (tab.url) {
      NavigationUtil.goPage(
        {
          title: tab.title,
          url: tab.url,
        },
        'WebViewPage',
      );
      return;
    }
    if (tab.account && tab.account.indexOf('@') > -1) {
      let url = 'mailto://' + tab.account;
      Linking.canOpenURL(url)
        .then(supported => {
          if (!supported) {
            console.log("Can't handle url: " + url);
          } else {
            return Linking.openURL(url);
          }
        })
        .catch(err => console.error('An error occurred', err));
      return;
    }
    if (tab.account) {
      Clipboard.setString(tab.account); //剪切板
      this.toast.show(tab.title + tab.account + '已复制到剪切板');
    }
  }
  getItem(menu) {
    return ViewUtil.getMenuItem(
      () => this.onClick(menu),
      menu,
      this.params.theme.themeColor,
    );
  }
  _item(data, isShow, key) {
    return ViewUtil.getSettingItem(
      () => {
        this.setState({
          [key]: !this.state[key],
        });
      },
      data.name,
      this.params.theme,
      Ionicons,
      data.icon,
      isShow ? 'ios-arrow-up' : 'ios-arrow-down',
    );
  }
  /**
   *显示列表数据
   * @param {*} dic
   * @param {*} isShowAccount
   */
  renderItems(dic, isShowAccount) {
    if (!dic) return false;
    let views = [];
    for (let i in dic) {
      let title = isShowAccount
        ? dic[i].title + ':' + dic[i].account
        : dic[i].title;
      views.push(
        <View key={i}>
          {ViewUtil.getSettingItem(
            () => this.onClick(dic[i]),
            title,
            this.params.theme.themeColor,
          )}
          <View style={GlobalStyles.line} />
        </View>,
      );
    }
    return views;
  }
  render() {
    const content = (
      <View>
        {/**教程 */}
        {this._item(
          this.state.data.aboutMe.Tutorial,
          this.state.showTutorial,
          'showTutorial',
        )}
        <View style={GlobalStyles.line} />
        {this.state.showTutorial
          ? this.renderItems(this.state.data.aboutMe.Tutorial.items)
          : null}
        {/**博客 */}
        {this._item(
          this.state.data.aboutMe.Blog,
          this.state.showBlog,
          'showBlog',
        )}
        <View style={GlobalStyles.line} />
        {this.state.showBlog
          ? this.renderItems(this.state.data.aboutMe.Blog.items)
          : null}
        {/**QQ */}
        {this._item(this.state.data.aboutMe.QQ, this.state.showQQ, 'showQQ')}
        <View style={GlobalStyles.line} />
        {this.state.showQQ
          ? this.renderItems(this.state.data.aboutMe.QQ.items)
          : null}
        {/**反馈 */}
        {this._item(
          this.state.data.aboutMe.Contact,
          this.state.showContact,
          'showContact',
        )}
        <View style={GlobalStyles.line} />
        {this.state.showContact
          ? this.renderItems(this.state.data.aboutMe.Contact.items)
          : null}
      </View>
    );
    return (
      <View style={{flex: 1}}>
        {this.aboutCommon.render(content, this.state.data.app)}
        <Toast ref={toast => (this.toast = toast)} position={'center'} />
      </View>
    );
  }
}
