import React from 'react';
import {
  View,
  Text,
  Platform,
  Image,
  Dimensions,
  StyleSheet,
  DeviceInfo,
} from 'react-native';
import BackPressComponent from '../../common/BackPreessComponent';
import NavigationUtil from '../../navigator/NavigationUtil';
//import config from '../../res/data/config.json';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import GlobalStyles from '../../res/styles/GlobalStyles';
import ViewUtil from '../../util/ViewUtil';
const THEME_COLOR = '#678';
export const FLAG_ABOUT = {flag_about: 'about', flag_about_me: 'about_me'};
export default class AboutCommon {
  constructor(props, updataState) {
    this.props = props;
    this.updataState = updataState;
    //统一处理返回键
    this.backPress = new BackPressComponent({
      backPress: () => this.onBackPress(),
    });
    // this.updataState({
    //   data: config,
    // });
  }
  onBackPress() {
    NavigationUtil.goBack(this.props.navigation);
    return true;
  }
  componentDidMount() {
    this.backPress.componentDidMount();
    //https://www.devio.org/io/GitHubPopular/json/github_app_config.json
    fetch('https://www.devio.org/io/GitHubPopular/json/github_app_config.json')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network Error');
      })
      .then(config => {
        if (config) {
          this.updataState({
            data: config,
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }
  onShare() {}
  getParallaxRenderConfig(params) {
    let config = {};
    let avatar =
      typeof params.avatar === 'string' ? {uri: params.avatar} : params.avatar;
    config.renderBackground = () => {
      <View key="background">
        <Image
          source={{
            uri:
              'https://c-ssl.duitang.com/uploads/item/201911/04/20191104143948_wjAiG.thumb.700_0.jpeg', // params.backgroundImg,
            width: window.width,
            height: PARALLAX_HEADER_HEIGHT,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            width: window.width,
            backgroundColor: 'rgba(0,0,0,.4)',
            height: PARALLAX_HEADER_HEIGHT,
          }}
        />
      </View>;
    };
    config.renderForeground = () => (
      <View key="parallax-header" style={styles.parallaxHeader}>
        <Image style={styles.avatar} source={avatar} />
        <Text style={styles.sectionSpeakerText}>{params.name}</Text>
        <Text style={styles.sectionTitleText}>{params.description}</Text>
      </View>
    );
    //顶部悬停区域的设置
    config.renderStickyHeader = () => {
      <View key="sticky-header" style={styles.stickySection}>
        <Text style={styles.stickySectionText}>{params.name}</Text>
      </View>;
    };
    //固定在顶部的内容
    config.renderFixedHeader = () => {
      <View key="fixed-header" style={styles.fixedSection}>
        {ViewUtil.getLeftBackButton(() =>
          NavigationUtil.goBack(this.props.navigation),
        )}
        {ViewUtil.getShareButton(() => this.onShare())}
      </View>;
    };
    return config;
  }
  render(contentView, params) {
    const renderConfig = this.getParallaxRenderConfig(params);
    return (
      <ParallaxScrollView
        backgroundColor={THEME_COLOR}
        contentBackgroundColor={GlobalStyles.backgroundColor}
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        stickyHeaderHeight={STICKY_HEADER_HEIGHT}
        backgroundScrollSpeed={10}
        {...renderConfig}>
        {contentView}
      </ParallaxScrollView>
    );
  }
}
const window = Dimensions.get('window');
const AVATAR_SIZE = 90;
const PARALLAX_HEADER_HEIGHT = 270;
const TOP =
  Platform.OS === 'ios' ? 20 + (DeviceInfo.isIPhoneX_deprecated ? 24 : 0) : 0;
const STICKY_HEADER_HEIGHT =
  Platform.OS === 'ios'
    ? GlobalStyles.nav_bar_height_ios + 20
    : GlobalStyles.nav_bar_height_android;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT,
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    alignItems: 'center',
    paddingTop: TOP,
  },
  stickySectionText: {
    color: 'white',
    fontSize: 20,
    margin: 10,
  },
  fixedSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: TOP,
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 20,
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 100,
  },
  avatar: {
    marginBottom: 10,
    borderRadius: AVATAR_SIZE / 2,
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 24,
    paddingVertical: 5,
    marginBottom: 10,
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 16,
    marginRight: 10,
    marginLeft: 10,
  },
});
