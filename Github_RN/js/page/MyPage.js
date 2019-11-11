import React from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action';
import NavigationUtil from '../navigator/NavigationUtil';
import NavigationBar from '../common/NavigationBar';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
const THEME_COLOR = '#678';
class MyPage extends React.Component {
  getRightButton() {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => {}}>
          <View style={{padding: 5, marginRight: 8}}>
            <Feather name={'search'} size={24} style={{color: 'white'}} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  getLeftButton(callBack) {
    return (
      <TouchableOpacity
        style={{padding: 8, paddingLeft: 12}}
        onPress={callBack}>
        <Ionicons name={'ios-arrow-back'} size={26} style={{color: 'white'}} />
      </TouchableOpacity>
    );
  }
  render() {
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
    };
    let navigationBar = (
      <NavigationBar
        title={'我的'}
        statusBar={statusBar}
        style={{backgroundColor: THEME_COLOR}}
        rightButton={this.getRightButton()}
        leftButton={this.getLeftButton()}
      />
    );
    return (
      <>
        {navigationBar}
        <View style={styles.container}>
          <Button
            title={'修改主题'}
            onPress={() => {
              // navigation.setParams({
              //   theme: {
              //     tintColor: 'lightblue',
              //     updateTime: new Date().getTime(),
              //   },
              // });
              this.props.onThemeChange('lightblue');
            }}
          />
          <Text
            onPress={() => {
              NavigationUtil.goPage({}, 'FetchDemoPage');
            }}>
            跳转到FetchDemoPage
          </Text>
          <Text
            onPress={() => {
              NavigationUtil.goPage({}, 'AsyncStorageDemoPage');
            }}>
            AsyncStorageDemoPage
          </Text>
          <Text
            onPress={() => {
              NavigationUtil.goPage({}, 'DataStoreDemoPage');
            }}>
            DataStoreDemoPage 离线缓存框架
          </Text>
        </View>
      </>
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
const mapDispatchTopProps = dispatch => ({
  onThemeChange: theme => dispatch(actions.onThemeChange(theme)),
});
export default connect(
  null,
  mapDispatchTopProps,
)(MyPage);
