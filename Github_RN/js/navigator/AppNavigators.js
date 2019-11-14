import React from 'react';
import {} from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import WelcomePage from '../page/WelcomePage';
import HomePage from '../page/HomePage';
import DetailPage from '../page/DetailPage';
import FetchDemoPage from '../page/FetchDemoPage';
import AsyncStorageDemoPage from '../page/AsyncStorageDemoPage';
import DataStoreDemoPage from '../page/DataStoreDemoPage';
//switchNavigator 将导航切成两部分  首页之前和首页之后

const IninNavigator = createStackNavigator({
  WelcomePage: {
    screen: WelcomePage,
    navigationOptions: {
      header: null, //隐藏头部
    },
  },
});
const MainNavigator = createStackNavigator({
  HomePage: {
    screen: HomePage,
    navigationOptions: {
      header: null,
    },
  },
  DetailPage: {
    screen: DetailPage,
    navigationOptions: {
      header: null,
    },
  },
  FetchDemoPage: {
    screen: FetchDemoPage,
  },
  AsyncStorageDemoPage: {
    screen: AsyncStorageDemoPage,
  },
  DataStoreDemoPage: {
    screen: DataStoreDemoPage,
  },
});
export default createAppContainer(
  createSwitchNavigator(
    {
      //仅显示其中一个,导航器默认显示第一个
      Init: IninNavigator,
      Main: MainNavigator,
    },
    {
      navigationOptions: {
        header: null,
      },
    },
  ),
);
