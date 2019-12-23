import React from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Button,
  RefreshControl,
  TouchableOpacity,
  Platform,
  Alert,
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
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import BackPressComponent from '../common/BackPreessComponent';
import GlobalStyles from '../res/styles/GlobalStyles';
import ViewUtil from '../util/ViewUtil';
import Utils from '../util/Utils';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
const pageSize = 10;
class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.backPress = new BackPressComponent({
      backPress: e => this.onBackPress(e),
    });
    this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular); //search和popular的地址一致
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
    this.isKeyChange = false; //tab的key是否有修改
  }
  componentDidMount() {
    this.backPress.componentDidMount();
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }

  loadData(loadMore) {
    const {onLoadMoreSearch, onSearch, search, keys} = this.props;
    if (loadMore) {
      onLoadMoreSearch(
        ++search.pageIndex,
        pageSize,
        search.items,
        this.favoriteDao,
        callback => {
          this.toast.show('没有更多了');
        },
      );
    } else {
      onSearch(
        this.inputKey,
        pageSize,
        (this.searchToken = new Date().getTime()),
        this.favoriteDao,
        keys,
        message => {
          this.toast.show(message);
        },
      );
    }
  }
  //返回事件
  onBackPress() {
    const {onSearchCancel, onLoadLanguage} = this.props;
    onSearchCancel(); //退出时取消搜索
    this.refs.input.blur();
    NavigationUtil.goBack(this.props.navigation);
    if (this.isKeyChange) {
      //若点击了底部的收藏按钮，则会重新加载标签
      onLoadLanguage(FLAG_LANGUAGE.flag_key); //重新加载标签
    }
    return true;
  }

  renderItem(data) {
    const item = data.item;
    const {theme} = this.params;
    return (
      <PopularItem
        projectModel={item}
        theme={theme}
        onSelect={callback => {
          NavigationUtil.goPage(
            {
              projectModel: item,
              flag: FLAG_STORAGE.flag_popular,
              callback,
              theme,
            },
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
    const {search} = this.props;
    return search.hideLoadingMore ? null : (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator style={styles.indicator} />
        <Text>正在加载更多</Text>
      </View>
    );
  }
  //保存收藏
  saveKey() {
    const {keys} = this.props;
    let key = this.inputKey;
    if (Utils.checkKeyIsExist(keys, key)) {
      this.toast.show(key + '已经存在');
    } else {
      key = {
        path: key,
        name: key,
        checked: true,
      };
      keys.unshift(key);
      this.languageDao.save(keys);
      this.toast.show(key.name + '保存成功');
      this.isKeyChange = true;
    }
  }
  onRightButtonClick() {
    const {onSearchCancel, search} = this.props;
    if (search.showText === '搜索') {
      this.loadData();
    } else {
      onSearchCancel(this.searchToken);
    }
  }
  renderNavBar() {
    const {theme} = this.params;
    const {showText, inputKey} = this.props.search;
    const placeholder = inputKey || '请输入';
    let backButton = ViewUtil.getLeftBackButton(() => {
      this.onBackPress();
    });
    let inputView = (
      <TextInput
        ref="input"
        placeholder={placeholder}
        onChangeText={text => (this.inputKey = text)}
        style={styles.textInput}
      />
    );
    let rightButton = (
      <TouchableOpacity
        onPress={() => {
          //   console.log(this.inputKey);
          this.refs.input.blur(); //收起键盘
          this.onRightButtonClick();
        }}>
        <View style={{marginRight: 10}}>
          <Text style={styles.title}>{showText}</Text>
        </View>
      </TouchableOpacity>
    );
    return (
      <View
        style={{
          backgroundColor: theme.themeColor,
          flexDirection: 'row',
          alignItems: 'center',
          height:
            Platform.OS === 'ios'
              ? GlobalStyles.nav_bar_height_ios
              : GlobalStyles.nav_bar_height_android,
        }}>
        {backButton}
        {inputView}
        {rightButton}
      </View>
    );
  }
  render() {
    let {
      isLoading,
      projectModels,
      showBottomButton,
      hideLoadingMore,
    } = this.props.search;
    const {theme} = this.params;
    let statusBar = null;
    if (Platform.OS === 'ios') {
      statusBar = (
        <View
          style={[
            styles.statusBar,
            {backgroundColor: this.params.theme.themeColor},
          ]}
        />
      );
    }
    let listView = !isLoading ? (
      <FlatList
        data={projectModels}
        renderItem={data => this.renderItem(data)}
        keyExtractor={item => {
          return '' + item.item.id;
        }}
        contentInset={
          //设置底部安全距离
          {
            bottom: 45,
          }
        }
        refreshControl={
          //下拉刷新组件
          <RefreshControl
            title={'loading'}
            titleColor={theme.themeColor}
            colors={[theme.themeColor]}
            refreshing={isLoading}
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
    ) : null;
    let bottomButton = showBottomButton ? (
      <TouchableOpacity
        style={[styles.bottomButton, {backgroundColor: theme.themeColor}]}
        onPress={() => {
          this.saveKey();
        }}>
        <View style={{justifyContent: 'center'}}>
          <Text style={styles.title}>朕收下了</Text>
        </View>
      </TouchableOpacity>
    ) : null;
    let indicatorView = isLoading ? (
      <ActivityIndicator
        style={styles.centering}
        size="large"
        animating={isLoading}
      />
    ) : null;
    let resultView = (
      <View style={{flex: 1}}>
        {indicatorView}
        {listView}
      </View>
    );
    return (
      <View style={styles.container}>
        {statusBar}
        {this.renderNavBar()}
        {resultView}
        {bottomButton}
        <Toast ref={toast => (this.toast = toast)} position={'center'} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  search: state.search,
  keys: state.language.keys,
});
const mapDispatchToProps = dispatch => ({
  onSearch: (inputKey, pageSize, token, favoriteDao, popularKeys, callBack) =>
    dispatch(
      actions.onSearch(
        inputKey,
        pageSize,
        token,
        favoriteDao,
        popularKeys,
        callBack,
      ),
    ),
  onSearchCancel: token => dispatch(actions.onSearchCancel(token)),
  onLoadMoreSearch: (pageIndex, pageSize, dataArray, favoriteDao, callBack) =>
    dispatch(
      actions.onLoadMoreSearch(
        pageIndex,
        pageSize,
        dataArray,
        favoriteDao,
        callBack,
      ),
    ),
  onLoadLanguage: flag => dispatch(actions.onLoadLanguage(flag)),
});
//注意：connect只是一个函数，并不一定要放在export后面
// eslint-disable-next-line prettier/prettier
export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
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
  statusBar: {
    height: 20,
  },
  bottomButton: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
    height: 40,
    position: 'absolute',
    left: 10,
    top: GlobalStyles.window_height - 45,
    right: 10,
    borderRadius: 3,
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  textInput: {
    flex: 1,
    height: Platform.OS === 'ios' ? 26 : 36,
    borderWidth: Platform.OS === 'ios' ? 1 : 1,
    borderColor: 'white',
    alignSelf: 'center',
    paddingLeft: 5,
    marginRight: 10,
    borderRadius: 3,
    opacity: 0.7,
    color: 'white',
  },
  title: {
    fontSize: 18,
    color: 'white',
    fontWeight: '500',
  },
});
