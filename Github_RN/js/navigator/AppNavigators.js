import React from 'react';
import {} from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import WelcomePage from '../page/WelcomePage';
import HomePage from '../page/HomePage';
import DetailPage from '../page/DetailPage';
import WebViewPage from '../page/WebViewPage';
import AboutPage from '../page/about/AboutPage';
import AboutMe from '../page/about/AboutMePage';
import CustomKeyPage from '../page/CustomKeyPage';
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
  WebViewPage: {
    screen: WebViewPage,
    navigationOptions: {
      header: null,
    },
  },
  AboutPage: {
    screen: AboutPage,
    navigationOptions: {
      header: null,
    },
  },
  AboutMe: {
    screen: AboutMe,
    navigationOptions: {
      header: null,
    },
  },
  CustomKeyPage: {
    screen: CustomKeyPage,
    navigationOptions: {
      header: null,
    },
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
