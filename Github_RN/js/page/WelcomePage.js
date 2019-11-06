import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil';
export default class WelcomePage extends React.Component {
  componentDidMount() {
    this.timer = setTimeout(() => {
      //跳转到首页
      NavigationUtil.resetToHomePage(this.props);
      //this.props.navigation.navigate('Main');
    }, 2000);
  }
  componentWillUnmount() {
    //页面销毁时清空定时器
    this.timer && clearTimeout(this.timer);
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>WelcomePage</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', //垂直方向的对齐方式
    justifyContent: 'center', //横轴方向的对齐方式
  },
});
