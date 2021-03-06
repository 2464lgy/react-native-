import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Text,
  TouchableHighlight,
} from 'react-native';
import actions from '../action';
import {connect} from 'react-redux'; //让组件和state树做关联
import NavigationBar from '../common/NavigationBar';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import BackPressComponent from '../common/BackPreessComponent';
import Checkbox from 'react-native-check-box';
import ViewUtil from '../util/ViewUtil';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationUtil from '../navigator/NavigationUtil';
import ArrayUtil from '../util/ArrayUtil';
import SortableListView from 'react-native-sortable-listview';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
class SortKeyPage extends React.Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.backPress = new BackPressComponent({
      backPress: e => this.onBackPress(e),
    });
    this.languageDao = new LanguageDao(this.params.flag);
    this.state = {
      checkedArray: SortKeyPage._keys(this.props), //筛选出选中的数据
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const checkedArray = SortKeyPage._keys(nextProps, prevState);
    if (prevState.keys !== checkedArray) {
      return {
        checkedArray: checkedArray,
      };
    }
    return null;
  }
  componentDidMount() {
    this.backPress.componentDidMount();
    //如果props中标签为空则从本地存储中获取标签
    if (SortKeyPage._keys(this.props).length === 0) {
      let {onLoadLanguage} = this.props;
      onLoadLanguage(this.params.flag);
    }
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }
  /**
   *获取标签
   * @param {*} props
   * @param {*} state  移除标签时使用
   */
  static _keys(props, state) {
    //如果state中有checkedArray则使用state中的checkedArray
    if (state && state.checkedArray && state.checkedArray.length) {
      return state.checkedArray;
    }
    //否则从原始数据中获取checkedArray
    const flag = SortKeyPage._flag(props);
    let dataArray = props.language[flag] || [];
    let keys = [];
    for (let i = 0, j = dataArray.length; i < j; i++) {
      let data = dataArray[i];
      if (data.checked) keys.push(data);
    }
    return keys; //获取所有选中的数据
  }
  static _flag(props) {
    const {flag} = props.navigation.state.params;
    return flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages';
  }
  onBackPress(e) {
    this.onBack();
    return true;
  }
  onSave(hasChecked) {
    if (!hasChecked) {
      //如果没有排序则直接返回
      if (
        ArrayUtil.isEqual(
          SortKeyPage._keys(this.props),
          this.state.checkedArray,
        )
      ) {
        NavigationUtil.goBack(this.props.navigation);
        return;
      }
    }
    //todo 保存排序后的数据
    //获取排序后的数据
    //更新本地数据
    this.languageDao.save(this.getSortResult());
    //重新加载排序后的标签，以便其他页面能够及时更新
    const {onLoadLanguage} = this.props;
    //更新store
    onLoadLanguage(this.params.flag);
    NavigationUtil.goBack(this.props.navigation);
  }
  /**
   * 获取排序后的标签结果
   */
  getSortResult() {
    const flag = SortKeyPage._flag(this.props);
    //从原始数据中复制一份数据出来，以便对这份数据进行排序
    let sortResultArray = ArrayUtil.clone(this.props.language[flag]);
    //获取排序之前的排列数据
    const originalCheckedArray = SortKeyPage._keys(this.props);
    //遍历排序之前的数据，用排序后的数据checkedArray进行替换
    for (let i = 0, j = originalCheckedArray.length; i < j; i++) {
      let item = originalCheckedArray[i];
      //找到要替换的元素所在位置
      let index = this.props.language[flag].indexOf(item);
      //进行替换
      sortResultArray.splice(index, 1, this.state.checkedArray[i]);
    }
    return sortResultArray;
  }

  onBack() {
    if (
      !ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)
    ) {
      Alert.alert('提示', '是否要保存修改？', [
        {
          text: '否',
          onPress: () => {
            NavigationUtil.goBack(this.props.navigation);
          },
        },
        {
          text: '是',
          onPress: () => {
            this.onSave(true);
          },
        },
      ]);
    } else {
      NavigationUtil.goBack(this.props.navigation);
    }
  }
  render() {
    const {theme} = this.props;
    let title =
      this.params.flag === FLAG_LANGUAGE.flag_language
        ? '语言排序'
        : '标签排序';
    let navigationBar = (
      <NavigationBar
        title={title}
        leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
        style={{backgroundColor: this.params.theme.themeColor}}
        rightButton={ViewUtil.getRightButton('保存', () => this.onSave())}
      />
    );
    return (
      <View style={styles.container}>
        {navigationBar}
        <SortableListView
          data={this.state.checkedArray}
          order={Object.keys(this.state.checkedArray)}
          onRowMoved={e => {
            //拖拽时触发
            this.state.checkedArray.splice(
              e.to,
              0,
              this.state.checkedArray.splice(e.from, 1)[0],
            );
            this.forceUpdate();
          }}
          renderRow={row => (
            <SortCell data={row} {...this.params} theme={theme} />
          )}
        />
      </View>
    );
  }
}
class SortCell extends React.Component {
  render() {
    const {theme} = this.props;
    return (
      <TouchableHighlight
        underlayColor={'#eee'}
        style={this.props.data.checked ? styles.item : styles.hidden}
        {...this.props.sortHandlers}>
        <View style={{marginLeft: 10, flexDirection: 'row'}}>
          <MaterialCommunityIcons
            name={'sort'}
            size={16}
            style={{marginRight: 10, color: this.params.theme.themeColor}}
          />
          <Text>{this.props.data.name}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}
const mapPopularStateToProps = state => ({
  language: state.language,
});
const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: flag => dispatch(actions.onLoadLanguage(flag)),
});

export default connect(
  mapPopularStateToProps,
  mapPopularDispatchToProps,
)(SortKeyPage);
const pageSize = 10; //设置为常量，防止修改

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
// eslint-disable-next-line prettier/prettier
const PopularTabPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SortKeyPage);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  line: {
    flex: 1,
    height: 0.3,
    backgroundColor: 'darkgray',
  },
  hidden: {
    height: 0,
  },
  item: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 50,
    justifyContent: 'center',
  },
});
