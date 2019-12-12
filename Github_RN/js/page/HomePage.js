import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';

// import FavoritePage from './FavoritePage';
// import PopularPage from './PopularPage';
// import TrendingPage from './TrendingPage';
// import MyPage from './MyPage';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import Entypo from 'react-native-vector-icons/Entypo';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationUtil from '../navigator/NavigationUtil';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import BackPreessComponent from '../common/BackPreessComponent';
import CustomTheme from '../page/CustomTheme';
import actions from '../action';
export default class HomePage extends React.Component {
  // _tabNavigator() {
  //   return createAppContainer(
  //     createBottomTabNavigator({
  //       PopularPage: {
  //         screen: PopularPage,
  //         navigationOptions: {
  //           tabBarLabel: '最热',
  //           tabBarIcon: ({tintColor, focused}) => {
  //             return (
  //               <MaterialIcons
  //                 name={'whatshot'}
  //                 size={26}
  //                 style={{color: tintColor}}
  //               />
  //             );
  //           },
  //         },
  //       },
  //       TrendingPage: {
  //         screen: TrendingPage,
  //         navigationOptions: {
  //           tabBarLabel: '趋势',
  //           tabBarIcon: ({tintColor, focused}) => (
  //             <Ionicons
  //               name={'md-trending-up'}
  //               size={26}
  //               style={{color: tintColor}}
  //             />
  //           ),
  //         },
  //       },
  //       FavoritePage: {
  //         screen: FavoritePage,
  //         navigationOptions: {
  //           tabBarLabel: '收藏',
  //           tabBarIcon: ({tintColor, focused}) => (
  //             <MaterialIcons
  //               name={'favorite'}
  //               size={26}
  //               style={{color: tintColor}}
  //             />
  //           ),
  //         },
  //       },
  //       MyPage: {
  //         screen: MyPage,
  //         navigationOptions: {
  //           tabBarLabel: '我的',
  //           tabBarIcon: ({tintColor, focused}) => (
  //             <Entypo name={'user'} size={26} style={{color: tintColor}} />
  //           ),
  //         },
  //       },
  //     }),
  //   );
  // }
  constructor(props) {
    super(props);
    this.backPress = new BackPreessComponent({backPress: this.backPress});
  }
  componentDidMount() {
    this.backPress.componentDidMount();
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }
  /**
    处理Android中的物理返回键
  */
  onBackPress = () => {
    const {dispatch, nav} = this.props;
    if (nav.routes[1].index === 0) {
      //如果RootNavigator中的MainNavigator的index为0，则不处理返回事件
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  };

  renderCustomThemeView() {
    const {customThemeViewVisible, onShowCustomThemeView} = this.props;
    return (
      <CustomTheme
        visible={customThemeViewVisible}
        {...this.props}
        onClose={() => onShowCustomThemeView(false)}
      />
    );
  }

  render() {
    //  const TabView = this._tabNavigator();
    //FIX DynamicTabNavigator中的页面无法跳转到最外层导航器页面的问题。
    NavigationUtil.navigation = this.props.navigation;
    return (
      // <View style={styles.container}>
      //   <Text style={styles.welcome}>HomePage</Text>
      // </View>
      <DynamicTabNavigator />
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
