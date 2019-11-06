import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  AsyncStorage,
} from 'react-native';
const KEY = 'save_key';
export default class AsyncStorageDemoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showText: '',
      storageValue: '',
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>AsyncStorageDemoPage</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => {
            this.value = text;
          }}
        />
        <Text>这里是存储的数据 {this.state.storageValue}</Text>
        <View style={styles.input_container}>
          <Button
            style={styles.button}
            onPress={() => {
              this.doSave();
            }}
            title="存储"
          />
          <Button
            style={styles.button}
            onPress={() => {
              this.getData();
            }}
            title="查询"
          />
          <Button
            onPress={() => {
              this.doRemove();
            }}
            title="删除"
          />
          <Button
            onPress={() => {
              this.doClear();
            }}
            title="清空"
          />
        </View>
        <Text>{this.state.showText}</Text>
      </View>
    );
  }
  getData() {
    AsyncStorage.getItem(KEY, (error, value) => {
      console.log(value);
      this.setState({
        storageValue: value,
      });
    });
  }
  doRemove() {
    AsyncStorage.removeItem(KEY);
  }
  doClear() {
    AsyncStorage.clear(KEY);
  }
  async doSave() {
    //方法一
    AsyncStorage.setItem(KEY, this.value, error => {
      error && console.log(error.toString());
    });
    //方法二
    // AsyncStorage.setItem(KEY, this.value).catch(error => {
    //   error && console.log(error.toString());
    // });
    //方法三
    // try {
    //   await AsyncStorage.setItem(KEY, this.value);
    // } catch (error) {
    //   error && console.log(error);
    // }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fcff',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  input_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    height: 30,
    borderColor: 'black',
    borderWidth: 1,
    marginRight: 10,
    padding: 0,
  },
  button: {
    paddingLeft: 30,
    paddingRight: 30,
  },
});
