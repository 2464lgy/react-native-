import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
export default class DetailPage extends React.Component {
  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>详情页</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },

  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
