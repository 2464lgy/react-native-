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
