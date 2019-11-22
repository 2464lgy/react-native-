import React from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
  RefreshControl,
} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import DeviceInfo from 'react-native-device-info';
import actions from '../action';
import {connect} from 'react-redux'; //让组件和state树做关联
import Toast from 'react-native-easy-toast';
import PopularItem from '../common/PopularItem';
import NavigationBar from '../common/NavigationBar';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import FavoriteDao from '../expand/dao/FavoriteDao';
import FavoriteUtil from '../util/FavoriteUtil';
import EventBus from 'react-native-event-bus';
import EventTypes from '../util/EventTypes';
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#678';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
export default class PopularPage extends React.Component {
  constructor(props) {
    super(props);
    this.tabNames = ['Java', 'Android', 'IOS', 'React', 'React Native', 'PHP'];
  }
  //动态生成tab
  _genTabs() {
    const tabs = {};
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <PopularTabPage {...this.props} tabLabel={item} />,
        navigationOptions: {
          title: item,
        },
      };
    });
    return tabs;
  }
  render() {
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
    };
    let navigationBar = (
      <NavigationBar
        title={'最热'}
        statusBar={statusBar}
        style={{backgroundColor: THEME_COLOR}}
      />
    );
    const TabNavigator = createAppContainer(
      createMaterialTopTabNavigator(
        // {
        //   PopularTab1: {
        //     screen: PopularTab,
        //     navigationOptions: {
        //       title: 'Tab1',
        //     },
        //   },
        //   PopularTab2: {
        //     screen: PopularTab,
        //     navigationOptions: {
        //       title: 'Tab2',
        //     },
        //   },
        // },

        this._genTabs(), //动态生成顶部导航
        {
          tabBarOptions: {
            tabStyle: styles.tabStyle,
            upperCaseLabel: false, //是否大写
            scrollEnabled: true, //是否可以滚动
            style: {
              backgroundColor: '#a67',
              //  height: 30, //开启scrollEnabled后在android上初次加载时闪烁问题
            },
            indicatorStyle: styles.indicatorStyle,
            labelStyle: styles.labelStyle,
          },
        },
      ),
    );
    return (
      <View style={styles.container}>
        {navigationBar}
        {/* <Text style={styles.welcome}>PopularPage</Text> */}
        <TabNavigator />
      </View>
    );
  }
}
const pageSize = 10; //设置为常量，防止修改
class PopularTab extends React.Component {
  constructor(props) {
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
    this.isFavoriteChanged = false;
  }
  componentDidMount() {
    this.loadData();
    EventBus.getInstance().addListener(
      EventTypes.favorite_changed_popular,
      (this.favoriteChangeListener = () => {
        this.isFavoriteChanged = true;
      }),
    );
    EventBus.getInstance().addListener(
      EventTypes.bottom_tab_select,
      (this.bottomTabSelectListener = data => {
        if (data.to === 0 && this.isFavoriteChanged) {
          this.loadData(null, true);
        }
      }),
    );
  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.favoriteChangeListener);
    EventBus.getInstance().removeListener(this.bottomTabSelectListener);
  }

  loadData(loadMore, refreshFavorite) {
    const store = this._store();
    const {
      onRefreshPopular,
      onLoadMorePopular,
      onFlushPopularFavorite,
    } = this.props;
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMorePopular(
        this.storeName,
        ++store.pageIndex,
        pageSize,
        store.items,
        favoriteDao,
        callback => {
          this.refs.toast.show('没有更多了');
        },
      );
    } else if (refreshFavorite) {
      onFlushPopularFavorite(
        this.storeName,
        store.pageIndex,
        pageSize,
        store.items,
        favoriteDao,
      );
    } else {
      onRefreshPopular(this.storeName, url, pageSize, favoriteDao);
    }
  }
  /**
   * 获取与当前页面相关的数据
   */
  _store() {
    const {popular} = this.props;
    let store = popular[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [], //要显示的数据
        hideLoadingMore: true, //默认隐藏加载更多
      };
    }
    return store;
  }
  genFetchUrl(key) {
    return URL + key + QUERY_STR;
  }
  renderItem(data) {
    const item = data.item;
    return (
      <PopularItem
        projectModel={item}
        onSelect={callback => {
          NavigationUtil.goPage(
            {projectModel: item, flag: FLAG_STORAGE.flag_popular, callback},
            'DetailPage',
          );
        }}
        onFavorite={(item, isFavorite) =>
          FavoriteUtil.onFavorite(
            favoriteDao,
            item,
            isFavorite,
            FLAG_STORAGE.flag_popular,
          )
        }
      />
      // <View style={{marginBottom: 10}}>
      //   <Text style={{backgroundColor: '#faa'}}>{JSON.stringify(item)}</Text>
      // </View>
    );
  }
  genIndicator() {
    return this._store().hideLoadingMore ? null : (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator style={styles.indicator} />
        <Text>正在加载更多</Text>
      </View>
    );
  }
  render() {
    let store = this._store(); //popular[this.storeName]; //动态获取state
    return (
      <View style={styles.container}>
        {/* <Text style={styles.welcome}>{tabLabel}</Text> */}
        <FlatList
          data={store.projectModels} //{store.items}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => {
            return '' + item.item.id;
          }}
          refreshControl={
            //下拉刷新组件
            <RefreshControl
              title={'loading'}
              titleColor={THEME_COLOR}
              colors={['red', 'blue']}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData(true)}
              tintColor={THEME_COLOR}
            />
          }
          ListFooterComponent={() => this.genIndicator()}
          onEndReached={() => {
            //确保此函数执行在onMomentumScrollBegin执行之后，所以设置延时
            //这里会多次调用，需要处理
            console.log('__________________________--');
            setTimeout(() => {
              if (this.canLoadMore) {
                this.loadData(true);
                this.canLoadMore = false;
              }
            }, 100);
          }}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.canLoadMore = true; //初始化时页面调用onEndReached的问题
          }}
        />
        <Toast ref={'toast'} position={'center'} />
      </View>
    );
    // return (
    //   <View style={styles.container}>
    //     <Text>PopularTab</Text>
    //     <Text
    //       onPress={() => {
    //         NavigationUtil.goPage({}, 'DetailPage');
    //       }}>
    //       跳转到详情页
    //     </Text>

    //     {/**
    //         Button 点击事件 下面的方法无效啊
    //       */}
    //     <Button
    //       title={'修改主题'}
    //       onPress={() => {
    //         // navigation.setParams({
    //         //   theme: {
    //         //     tintColor: 'yellow',
    //         //     updateTime: new Date().getTime(),
    //         //   },
    //         // });
    //         this.props.onThemeChange('yellow');
    //       }}
    //     />
    //   </View>
    // );
  }
}
const mapStateToProps = state => ({
  popular: state.popular,
});
const mapDispatchToProps = dispatch => ({
  onRefreshPopular: (storeName, url, pageSize, favoriteDao) =>
    dispatch(actions.onRefreshPopular(storeName, url, pageSize, favoriteDao)),
  onLoadMorePopular: (
    storeName,
    pageIndex,
    pageSize,
    dataArray,
    favoriteDao,
    callBack,
  ) =>
    dispatch(
      actions.onLoadMorePopular(
        storeName,
        pageIndex,
        pageSize,
        dataArray,
        favoriteDao,
        callBack,
      ),
    ),
  onFlushPopularFavorite: (
    storeName,
    pageIndex,
    pageSize,
    items,
    favoriteDao,
  ) =>
    dispatch(
      actions.onFlushPopularFavorite(
        storeName,
        pageIndex,
        pageSize,
        items,
        favoriteDao,
      ),
    ),
});
//注意：connect只是一个函数，并不一定要放在export后面
const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: DeviceInfo.getModel() === 'iPhone X' ? 30 : 0,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  tabStyle: {
    // minWidth: 50,
    padding: 0,
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white',
  },
  labelStyle: {
    fontSize: 13,
    margin: 0,
  },
  indicatorContainer: {
    alignItems: 'center',
  },
  indicator: {
    color: 'red',
    margin: 10,
  },
});
// const mapDispatchToProps = dispatch => ({
//   onThemeChange: theme => dispatch(actions.onThemeChange(theme)),
// });
// export default connect(
//   null,
//   mapDispatchToProps,
// )(PopularPage);
