import React from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import actions from '../action';
import {connect} from 'react-redux'; //让组件和state树做关联
import Toast from 'react-native-easy-toast';
import TrendingItem from '../common/TrendingItem';
import NavigationBar from '../common/NavigationBar';
import TrendingDialog, {TimeSpans} from '../common/TrendingDialog';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FavoriteUtil from '../util/FavoriteUtil';
import FavoriteDao from '../expand/dao/FavoriteDao';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import EventBus from 'react-native-event-bus';
import EventTypes from '../util/EventTypes';
import {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import ArrayUtil from '../util/ArrayUtil';
const URL = 'https://github.com/trending/';
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);
class TrendingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeSpan: TimeSpans[0],
    };
    const {onLoadLanguage} = this.props;
    onLoadLanguage(FLAG_LANGUAGE.flag_language);
    this.preKeys = [];
  }
  //动态生成tab
  _genTabs() {
    const tabs = {};
    const {keys, theme} = this.props;
    this.preKeys = keys;
    keys.forEach((item, index) => {
      if (item.checked) {
        tabs[`tab${index}`] = {
          screen: props => (
            <TrendingTabPage
              {...this.props}
              timeSpan={this.state.timeSpan}
              tabLabel={item.name}
              theme={theme}
            />
          ),
          navigationOptions: {
            title: item.name,
          },
        };
      }
    });
    return tabs;
  }
  renderTitleView() {
    return (
      <View>
        <TouchableOpacity
          ref="button"
          underlayColor="transparent"
          onPress={() => this.dialog.show()}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontSize: 18, color: '#ffffff', fontWeight: '400'}}>
              趋势 {this.state.timeSpan.showText}
            </Text>
            <MaterialIcons
              name={'arrow-drop-down'}
              size={22}
              style={{color: 'white'}}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  onSelectTimeSpan(tab) {
    this.dialog.dismiss();
    this.setState({
      timeSpan: tab,
    });
    DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab);
  }
  renderTrendingDialog() {
    return (
      <TrendingDialog
        ref={dialog => (this.dialog = dialog)}
        onSelect={tab => this.onSelectTimeSpan(tab)}
      />
    );
  }
  _tabNav() {
    const {theme} = this.props;
    //注意：主题发生变化需要重新渲染
    if (
      theme !== this.theme ||
      !this.tabNav ||
      !ArrayUtil.isEqual(this.preKeys, this.props.keys)
    ) {
      this.theme = theme;
      //优化效率：根据需要选择是否重新创建tabNavigator
      this.tabNav = createMaterialTopTabNavigator(
        this._genTabs(), //动态生成顶部导航
        {
          tabBarOptions: {
            tabStyle: styles.tabStyle,
            upperCaseLabel: false, //是否大写
            scrollEnabled: true, //是否可以滚动
            style: {
              backgroundColor: theme.themeColor,
            },
            indicatorStyle: styles.indicatorStyle,
            labelStyle: styles.labelStyle,
          },
          lazy: true,
        },
      );
    }
    return createAppContainer(this.tabNav);
  }
  render() {
    const {keys, theme} = this.props;
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content',
    };
    let navigationBar = (
      <NavigationBar
        //    title={'最热'}
        titleView={this.renderTitleView()}
        statusBar={statusBar}
        style={theme.styles.navBar}
      />
    );
    const TabNavigator = keys.length ? this._tabNav() : null;
    return (
      <View style={styles.container}>
        {navigationBar}
        {TabNavigator && <TabNavigator />}
        {this.renderTrendingDialog()}
      </View>
    );
  }
}

const mapTrenderingStateToProps = state => ({
  keys: state.language.languages,
  theme: state.theme.theme,
});
const mapTrendingDispatchToProps = dispatch => ({
  onLoadLanguage: flag => dispatch(actions.onLoadLanguage(flag)),
});
export default connect(
  mapTrenderingStateToProps,
  mapTrendingDispatchToProps,
)(TrendingPage);
const pageSize = 10; //设置为常量，防止修改
class TrendingTab extends React.Component {
  constructor(props) {
    super(props);
    const {tabLabel, timeSpan} = this.props;
    this.storeName = tabLabel;
    this.timeSpan = timeSpan;
    this.isFavoriteChanged = false;
  }
  componentDidMount() {
    this.loadData();
    this.timeSpanChangeListener = DeviceEventEmitter.addListener(
      EVENT_TYPE_TIME_SPAN_CHANGE,
      timeSpan => {
        this.timeSpan = timeSpan;
        this.loadData();
      },
    );
    EventBus.getInstance().addListener(
      EventTypes.favoriteChanged_trending,
      (this.favoriteChangeListener = () => {
        this.isFavoriteChanged = true;
      }),
    );
    EventBus.getInstance().addListener(
      EventTypes.bottom_tab_select,
      (this.bottomTabSelectListener = data => {
        if (data.to === 1 && this.isFavoriteChanged) {
          this.loadData(null, true);
        }
      }),
    );
  }
  componentWillUnmount() {
    if (this.timeSpanChangeListener) {
      this.timeSpanChangeListener.remove();
    }
    EventBus.getInstance().removeListener(this.favoriteChangeListener);
    EventBus.getInstance().removeListener(this.bottomTabSelectListener);
  }
  loadData(loadMore, refreshFavorite) {
    const store = this._store();
    const {
      onRefreshTrending,
      onLoadMoreTrending,
      onFlushTrendingFavorite,
    } = this.props;
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMoreTrending(
        this.storeName,
        ++store.pageIndex,
        pageSize,
        store.items,
        callback => {
          this.refs.toast.show('没有更多了');
        },
      );
    } else if (refreshFavorite) {
      onFlushTrendingFavorite(
        this.storeName,
        store.pageIndex,
        pageSize,
        store.items,
        favoriteDao,
      );
      this.isFavoriteChanged = false;
    } else {
      onRefreshTrending(this.storeName, url, pageSize, favoriteDao);
    }
  }
  /**
   * 获取与当前页面相关的数据
   */
  _store() {
    const {trending} = this.props;
    let store = trending[this.storeName];
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
    return URL + key + '?' + this.timeSpan.searchText;
  }
  renderItem(data) {
    const item = data.item;
    const {theme} = this.props;
    return (
      <TrendingItem
        projectModel={item}
        theme={theme}
        onSelect={callback => {
          NavigationUtil.goPage(
            {
              projectModel: item,
              flag: FLAG_STORAGE.flag_trending,
              callback,
              theme,
            },
            'DetailPage',
          );
        }}
        onFavorite={(item, isFavorite) => {
          FavoriteUtil.onFavorite(
            favoriteDao,
            item,
            isFavorite,
            FLAG_STORAGE.flag_trending,
          );
        }}
      />
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
    let store = this._store(); //动态获取state
    const {theme} = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels} //{store.items}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => {
            console.log(item);
            if (item.item) {
              return '' + item.item.fullName;
            }
            return '' + item.fullName;
          }}
          refreshControl={
            //下拉刷新组件
            <RefreshControl
              title={'loading'}
              titleColor={theme.themeColor}
              colors={[theme.themeColor]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
              tintColor={theme.themeColor}
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
  }
}
const mapStateToProps = state => ({
  trending: state.trending,
});
const mapDispatchToProps = dispatch => ({
  onRefreshTrending: (storeName, url, pageSize, favoriteDao) =>
    dispatch(actions.onRefreshTrending(storeName, url, pageSize, favoriteDao)),
  onLoadMoreTrending: (
    storeName,
    pageIndex,
    pageSize,
    dataArray,
    favoriteDao,
    callBack,
  ) =>
    dispatch(
      actions.onLoadMoreTrending(
        storeName,
        pageIndex,
        pageSize,
        dataArray,
        favoriteDao,
        callBack,
      ),
    ),
  onFlushTrendingFavorite: (
    storeName,
    pageIndex,
    pageSize,
    items,
    favoriteDao,
  ) =>
    dispatch(
      actions.onFlushTrendingFavorite(
        storeName,
        pageIndex,
        pageSize,
        items,
        favoriteDao,
      ),
    ),
});
//注意：connect只是一个函数，并不一定要放在export后面
const TrendingTabPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrendingTab);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  tabStyle: {
    minWidth: 50,
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white',
  },
  labelStyle: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 6,
  },
  indicatorContainer: {
    alignItems: 'center',
  },
  indicator: {
    color: 'red',
    margin: 10,
  },
});
