import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action';
import NavigationUtil from '../navigator/NavigationUtil';
import NavigationBar from '../common/NavigationBar';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MORE_MENU} from '../common/MORE_MENU';
import GlobalStyles from '../res/GlobalStyles';
import ViewUtil from '../util/ViewUtil';
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
  onClick(menu) {}
  getItem(menu) {
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR);
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
        <View style={GlobalStyles.root_container}>
          <ScrollView>
            <TouchableOpacity
              style={styles.item}
              onPress={this.onClick(MORE_MENU.About)}>
              <View style={styles.about_left}>
                <Ionicons
                  name={MORE_MENU.About.icon}
                  size={40}
                  style={{marginRight: 10, color: THEME_COLOR}}
                />
                <Text>GitHub Popular</Text>
              </View>
              <Ionicons
                name={'ios-arrow-forward'}
                size={16}
                style={{
                  marginRight: 10,
                  alignSelf: 'center',
                  color: THEME_COLOR,
                }}
              />
            </TouchableOpacity>
            <View style={GlobalStyles.line} />
            {this.getItem(MORE_MENU.Tutorial)}
            {/*趋势管理 */}
            <Text style={styles.groupTitle}>趋势管理</Text>
            {/**自定义语言 */}
            {this.getItem(MORE_MENU.Custom_Language)}
            {/**语言排序 */}
            <View style={GlobalStyles.line} />
            {this.getItem(MORE_MENU.Sort_Language)}

            {/**最热管理 */}

            {this.getItem(MORE_MENU.Sort_Key)}
            {this.getItem(MORE_MENU.Custom_Language)}
            {this.getItem(MORE_MENU.Custom_Language)}
            {this.getItem(MORE_MENU.Custom_Language)}
          </ScrollView>
        </View>
      </>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  about_left: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  item: {
    backgroundColor: 'white',
    padding: 10,
    height: 90,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  groupTitle: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,
    color: 'gray',
  },
});
const mapDispatchTopProps = dispatch => ({
  onThemeChange: theme => dispatch(actions.onThemeChange(theme)),
});
export default connect(null, mapDispatchTopProps)(MyPage);
