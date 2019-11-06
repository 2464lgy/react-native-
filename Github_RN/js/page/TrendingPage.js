import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action';
class TrendingPage extends React.Component {
  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>TrendingPage</Text>
        <Button
          title={'修改主题'}
          onPress={() => {
            // navigation.setParams({
            //   theme: {
            //     tintColor: 'red',
            //     updateTime: new Date().getTime(),
            //   },
            // });
            this.props.onThemeChange('red');
          }}
        />
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
const mapDispatchToProps = dispatch => ({
  onThemeChange: theme => dispatch(actions.onThemeChange(theme)),
});
export default connect(
  null,
  mapDispatchToProps,
)(TrendingPage);
