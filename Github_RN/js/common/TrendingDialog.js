import React from 'react';
import {Modal, TouchableOpacity, StyleSheet, View, Text} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import TimeSpan from '../model/TimeSpan';
const NAV_BAR_HIGHT_IOS = 44; //导航栏在IOS中的高度
const NAV_BAR_HIGHT_ANDROID = 50; //导航栏在Android中的高度
const STATUS_BAR_HIGHT = 20; //状态栏的高度
const StatusBarShape = {
  //设置状态栏所接受的属性
  barStyle: PropTypes.oneOf(['light-content', 'default']),
  hidden: PropTypes.bool,
  backgroundColor: PropTypes.string,
};
export const TimeSpans = [
  new TimeSpan('今天', 'since=daily'),
  new TimeSpan('本月', 'since=monthly'),
  new TimeSpan('本年', 'since=yearly'),
];
export default class TrendingDialog extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   visible: false,
    // };
  }
  state = {
    visible: false,
  };
  show() {
    this.setState({
      visible: true,
    });
  }
  dismiss() {
    this.setState({
      visible: false,
    });
  }
  onSelect(obj) {
    console.log(obj);
  }
  render() {
    const {onClose, onSelect} = this.props;
    return (
      <Modal
        transparent={true}
        visible={this.state.visible}
        onRequestClose={() => onClose}>
        <TouchableOpacity
          onPress={() => this.dismiss()}
          style={styles.container}>
          <MaterialIcons
            name={'arrow-drop-up'}
            size={36}
            style={styles.arrow}
          />
          <View style={styles.content}>
            {TimeSpans.map((result, i, arr) => {
              return (
                <TouchableOpacity
                  underlayColor="transparent"
                  onPress={() => onSelect(arr[i])}>
                  <View style={styles.text_container}>
                    <Text style={styles.text}>{arr[i].showText}</Text>
                    {i !== TimeSpans.length - 1 ? (
                      <View style={styles.line} />
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
    alignItems: 'center',
  },
  arrow: {
    marginTop: 40,
    color: 'white',
    padding: 0,
    margin: -15,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 3,
    paddingTop: 3,
    paddingBottom: 3,
    marginRight: 3,
  },
  text_container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    color: 'black',
    fontWeight: '400',
    padding: 8,
    paddingLeft: 26,
    paddingRight: 26,
  },
  line: {
    height: 0.3,
    backgroundColor: 'darkgray',
  },
});
