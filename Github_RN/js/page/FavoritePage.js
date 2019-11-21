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
import TrendingItem from '../common/TrendingItem';
const THEME_COLOR = '#678';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
export default class FavoritePage extends React.Component {
  constructor(props) {
    super(props);
    this.tabNames = ['最热', '趋势'];
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
        {
          Popular: {
            screen: props => (
              <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular} />
            ),
            navigationOptions: {
              title: '最热',
            },
          },
          Trending: {
            screen: props => (
              <FavoriteTabPage flag={FLAG_STORAGE.flag_trending} />
            ),
            navigationOptions: {
              title: '趋势',
            },
          },
        },
        {
          tabBarOptions: {
            tabStyle: styles.tabStyle,
            upperCaseLabel: false, //是否大写
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
class FavoriteTab extends React.Component {
  constructor(props) {
    super(props);
    const {flag} = this.props;
    this.storeName = flag;
    this.favoriteDao = new FavoriteDao(flag);
  }
  componentDidMount() {
    this.loadData();
  }
  loadData(isShowLoading) {
    const {onLoadFavoriteData} = this.props;
    onLoadFavoriteData(this.storeName, isShowLoading);
  }
  /**
   * 获取与当前页面相关的数据
   */
  _store() {
    const {favorite} = this.props;
    let store = favorite[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [], //要显示的数据
      };
    }
    return store;
  }
  renderItem(data) {
    const item = data.item;
    const Item =
      this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
    return (
      <Item
        projectModel={item}
        onSelect={callback => {
          NavigationUtil.goPage(
            {projectModel: item, flag: this.storeName, callback},
            'DetailPage',
          );
        }}
        onFavorite={(item, isFavorite) =>
          FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, this.storeName)
        }
      />
    );
  }

  render() {
    let store = this._store();
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels} //{store.items}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => {
            return '' + (item.item.id || item.item.fullName);
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
        />
        <Toast ref={'toast'} position={'center'} />
      </View>
    );
  }
}
const mapStateToProps = state => ({
  favorite: state.favorite,
});
const mapDispatchToProps = dispatch => ({
  onLoadFavoriteData: (storeName, isShowLoading) =>
    dispatch(actions.onLoadFavoriteData(storeName, isShowLoading)),
});
//注意：connect只是一个函数，并不一定要放在export后面
const FavoriteTabPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FavoriteTab);
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
