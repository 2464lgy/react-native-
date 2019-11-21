import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import WebView from 'react-native-webview';
import NavigationUtil from '../navigator/NavigationUtil';
import DeviceInfo from 'react-native-device-info';
import BackPressComponent from '../common/BackPreessComponent';
import FavoriteDao from '../expand/dao/FavoriteDao';
const THEME_COLOR = '#689';
const TRENDING_URL = 'https://github.com/';
export default class DetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const {projectModel, flag} = this.params;
    this.favoriteDao = new FavoriteDao(flag);
    this.url =
      projectModel.item.html_url || TRENDING_URL + projectModel.item.fullName;
    const title = projectModel.item.full_name || projectModel.item.fullName;
    this.state = {
      title,
      url: this.url,
      canGoBack: false,
      isFavorite: projectModel.isFavorite,
    };
    this.backPress = new BackPressComponent({
      backPress: () => this.onBackPress(),
    });
  }
  componentDidMount() {
    this.backPress.componentDidMount();
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }
  onBackPress() {
    this.onBack();
    return true;
  }
  onBack() {
    if (this.state.canGoBack) {
      this.webView.goBack();
    } else {
      NavigationUtil.goBack(this.props.navigation);
    }
  }
  onFavoriteButtonClick() {
    const {projectModel, callback} = this.params;
    const isFavorite = (projectModel.isFavorite = !projectModel.isFavorite);
    callback(isFavorite); //更新Item的收藏状态
    this.setState({
      isFavorite: isFavorite,
    });
    let key = projectModel.item.fullName
      ? projectModel.item.fullName
      : projectModel.item.id.toString();
    if (projectModel.isFavorite) {
      this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item));
    } else {
      this.favoriteDao.removeFavoriteItem(key);
    }
  }
  renderRightButton() {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          //处理收藏状态
          onPress={() => this.onFavoriteButtonClick()}>
          <FontAwesome
            name={this.state.isFavorite ? 'star' : 'star-o'}
            size={20}
            style={{color: 'white', marginRight: 10}}
          />
        </TouchableOpacity>
        {ViewUtil.getShareButton(() => {})}
      </View>
    );
  }
  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url,
    });
  }
  render() {
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
    };
    let titleLayoutStyle =
      this.state.title.length > 20 ? {paddingRight: 30} : null;
    let navigationBar = (
      <NavigationBar
        title={this.state.title}
        leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
        titleLayoutStyle={titleLayoutStyle}
        statusBar={statusBar}
        style={{backgroundColor: THEME_COLOR}}
        rightButton={this.renderRightButton()}
      />
    );
    return (
      <View style={styles.container}>
        {navigationBar}
        <WebView
          ref={webView => (this.webView = webView)}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
          source={{uri: this.state.url}}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: DeviceInfo.getModel === 'iPhone X' ? 30 : 0,
  },
});
