import React from 'react';
import FavoritePage from '../page/FavoritePage';
import PopularPage from '../page/PopularPage';
import TrendingPage from '../page/TrendingPage';
import MyPage from '../page/MyPage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator, BottomTabBar} from 'react-navigation-tabs';
import {connect} from 'react-redux';
import EventTypes from '../util/EventTypes';
import EventBus from 'react-native-event-bus';
const TABS = {
  //在这里配置页面的路由
  PopularPage: {
    screen: PopularPage,
    navigationOptions: {
      tabBarLabel: '最热',
      tabBarIcon: ({tintColor, focused}) => {
        return (
          <MaterialIcons
            name={'whatshot'}
            size={26}
            style={{color: tintColor}}
          />
        );
      },
    },
  },
  TrendingPage: {
    screen: TrendingPage,
    navigationOptions: {
      tabBarLabel: '趋势',
      tabBarIcon: ({tintColor, focused}) => (
        <Ionicons
          name={'md-trending-up'}
          size={26}
          style={{color: tintColor}}
        />
      ),
    },
  },
  FavoritePage: {
    screen: FavoritePage,
    navigationOptions: {
      tabBarLabel: '收藏',
      tabBarIcon: ({tintColor, focused}) => (
        <MaterialIcons name={'favorite'} size={26} style={{color: tintColor}} />
      ),
    },
  },
  MyPage: {
    screen: MyPage,
    navigationOptions: {
      tabBarLabel: '我的',
      tabBarIcon: ({tintColor, focused}) => (
        <Entypo name={'user'} size={26} style={{color: tintColor}} />
      ),
    },
  },
};

class DynamicTabNavigator extends React.Component {
  constructor(props) {
    super(props);
    console.disableYellowBox = true; //关闭黄色警告弹框
  }
  _tabNavigator() {
    if (this.Tabs) {
      return this.Tabs;
    }
    const {PopularPage, TrendingPage, FavoritePage, MyPage} = TABS;
    const tabs = {PopularPage, TrendingPage, FavoritePage, MyPage};
    PopularPage.navigationOptions.tabBarLabel = '最热'; //修改tab 标题
    return (this.Tabs = createAppContainer(
      createBottomTabNavigator(tabs, {
        tabBarComponent: props => {
          return <TabBarComponent theme={this.props.theme} {...props} />;
        },
      }), // {tabBarComponent: TabBarComponent}), //tabBarComponent指定createBottomTabNavigator的TabBar组件，android默认使用TabBarTop
    ));
  }
  render() {
    const Tab = this._tabNavigator();
    return (
      <Tab
        //下面方法在底部tab发生切换时回调
        onNavigationStateChange={(prevState, newState, action) => {
          EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select, {
            //发送底部tab切换的事件
            from: prevState.index,
            to: newState.index,
          });
        }}
      />
    );
  }
}
class TabBarComponent extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.theme = {
  //     tintColor: props.activeTintColor,
  //     updateTime: new Date().getTime(),
  //   };
  // }
  render() {
    // const {routes, index} = this.props.navigation.state; //依靠传参来修改主题
    // if (routes[index].params) {
    //   const {theme} = routes[index].params;
    //   //以最新的更新时间为主，防止被其他tab之前的修改覆盖掉
    //   if (theme && theme.updateTime > this.theme.updateTime) {
    //     this.theme = theme;
    //   }
    // }
    return (
      <BottomTabBar
        {...this.props}
        activeTintColor={this.props.theme.themeColor} //{this.theme.tintColor || this.props.activeTintColor}
      />
    );
  }
}
const mapStateToProps = state => ({
  theme: state.theme.theme,
});
export default connect(mapStateToProps)(DynamicTabNavigator); //将redux和当前组件关联起来
