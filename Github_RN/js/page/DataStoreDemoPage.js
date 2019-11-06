import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  AsyncStorage,
} from 'react-native';
import DataStore from '../expand/dao/DataStore';
const KEY = 'save_key';
export default class DataStoreDemoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showText: '',
      storageValue: '',
    };
    this.dataStore = new DataStore();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>DataStoreDemoPage</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => {
            this.value = text;
          }}
        />
        <View style={styles.input_container}>
          <Button
            style={styles.button}
            onPress={() => {
              this.loadData();
            }}
            title="获取数据"
          />
        </View>
        <Text>{this.state.showText}</Text>
      </View>
    );
  }

  loadData() {
    let url = `https://api.github.com/search/repositories?q=${this.value}`;
    this.dataStore
      .fetchData(url)
      .then(data => {
        let showData = `初次数据加载时间：${new Date(
          data.timestamp,
        )}\n${JSON.stringify(data.data)}`;
        this.setState({
          showText: showData,
        });
      })
      .catch(error => {
        error && console.log(error.toString());
      });
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
