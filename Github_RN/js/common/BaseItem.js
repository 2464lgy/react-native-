import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PropsTypes from 'prop-types';
export default class BaseItem extends React.Component {
  static propTypes = {
    projectModel: PropsTypes.object,
    onSelect: PropsTypes.func,
    onFavorite: PropsTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      isFavorite: this.props.projectModel.isFavorite,
    };
  }
  /**
   *牢记：componentWillReceiveProps在新版React中不能再用了
   * @param {*} nextProps
   * @param {*} prevState
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    //state之中数据改变时进入函数
    const isFavorite = nextProps.projectModel.isFavorite;
    if (prevState.isFavorite !== isFavorite) {
      return {
        isFavorite: isFavorite,
      };
    }
    return null;
  }
  setFavoriteState(isFavorite) {
    this.props.projectModel.isFavorite = isFavorite;
    this.setState({
      isFavorite: isFavorite,
    });
  }
  onItemClick() {
    this.props.onSelect(isFavorite => {
      this.setFavoriteState(isFavorite);
    });
  }
  onPressFavorite() {
    this.setFavoriteState(!this.state.isFavorite);
    this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite);
  }
  _favoriteIcon() {
    return (
      <TouchableOpacity
        style={{padding: 6}}
        underlayColor="transparent"
        onPress={() => this.onPressFavorite()}>
        <FontAwesome
          name={this.state.isFavorite ? 'star' : 'star-o'}
          size={26}
          style={{color: '#678'}}
        />
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({});
