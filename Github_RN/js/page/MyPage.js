import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action';
import NavigationUtil from '../navigator/NavigationUtil';

class MyPage extends React.Component {
  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>MyPage</Text>
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
