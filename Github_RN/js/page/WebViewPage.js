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
export default class WebViewPage extends React.Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const {title, url} = this.params;
    this.state = {
      title,
      url: url,
      canGoBack: false,
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
        style={{backgroundColor: THEME_COLOR}}
        leftButton={ViewUtil.getLeftBackButton(() => {
          this.onBackPress();
        })}
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
