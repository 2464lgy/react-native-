import React from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Button,
  RefreshControl,
} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import actions from '../action';
import {connect} from 'react-redux'; //让组件和state树做关联
import PopularItem from '../common/PopularItem';
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = 'red';
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
            },
            indicatorStyle: styles.indicatorStyle,
            labelStyle: styles.labelStyle,
          },
        },
      ),
    );
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>PopularPage</Text>
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
  }
  componentDidMount() {
    this.loadData();
  }
  loadData(loadMore) {
    const {onLoadPopularData, onLoadMorePopular} = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMorePopular(
        this.storeName,
        ++store.pageIndex,
        pageSize,
        store.items,
        callback => {},
      );
    } else {
      onLoadPopularData(this.storeName, url);
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
        projectModes: [], //要显示的数据
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
      <PopularItem item={item} onSelect={() => {}} />
      // <View style={{marginBottom: 10}}>
      //   <Text style={{backgroundColor: '#faa'}}>{JSON.stringify(item)}</Text>
      // </View>
    );
  }
  render() {
    //  const {navigation} = this.props;
    // const {tabLabel} = this.props;
    const {popular} = this.props;
    let store = popular[this.storeName]; //动态获取state
    if (!store) {
      store = {
        items: [],
        isLoading: false,
      };
    }
    return (
      <View style={styles.container}>
        {/* <Text style={styles.welcome}>{tabLabel}</Text> */}
        <FlatList
          data={store.items}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => '' + item.id}
          refreshControl={
            //下拉刷新组件
            <RefreshControl
              title={'loading'}
              titleColor={THEME_COLOR}
              colors={['red', 'blue']}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
              tintColor={THEME_COLOR}
            />
          }
        />
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
  onRefreshPopular: (storeName, url, pageSize) =>
    dispatch(actions.onRefreshPopular(storeName, url, pageSize)),
  onLoadMorePopular: (storeName, url, pageSize) =>
    dispatch(actions.onLoadMorePopular(storeName, url, pageSize)),
});
const PopularTabPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PopularTab);
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
});
// const mapDispatchToProps = dispatch => ({
//   onThemeChange: theme => dispatch(actions.onThemeChange(theme)),
// });
// export default connect(
//   null,
//   mapDispatchToProps,
// )(PopularPage);
