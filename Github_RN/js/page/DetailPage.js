import React from 'react';
import {View, StyleSheet} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import WebView from 'react-native-webview';
import NavigationUtil from '../navigator/NavigationUtil';
const THEME_COLOR = 'red';
const TRENDING_URL = 'https://github.com/';
export default class DetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const {projectModel} = this.params;
    this.url = projectModel.html_url || TRENDING_URL + projectModel.fullName;
    const title = projectModel.full_name || projectModel.fullName;
    this.state = {
      title,
      url: this.url,
      canGoBack: false,
    };
  }
  onBack() {
    if (this.state.canGoBack) {
      this.webView.goBack();
    } else {
      NavigationUtil.goBack(this.props.navigation);
    }
  }
  renderRightButton() {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => {}}>
          <FontAwesome
            name={'star-o'}
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
    let navigationBar = (
      <NavigationBar
        title={this.state.title}
        leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },

  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
