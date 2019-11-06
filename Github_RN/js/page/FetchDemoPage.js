import React from 'react';
import {View, Text, StyleSheet, Button, TextInput} from 'react-native';
export default class FetchDemoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showText: '',
    };
  }
  loadData2() {
    //https://api.github.com/search/repositories?q=java
    let url = `https://api.github.com/search/repositories?q=${this.searchKey}`;
    fetch(url)
      .then(response => response.text())
      .then(responseText => {
        this.setState({showText: responseText});
      });
  }
  //网络异常处理
  loadDataB() {
    //https://api.github.com/search/repositories?q=java
    let url = `https://api.github.com/search/repositories?q=${this.searchKey}`;
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.text();
        }
        throw new Error('Network response was not ok');
      })
      .then(responseText => {
        this.setState({showText: responseText});
      })
      .catch(err => {
        this.setState({
          showText: err.toString(),
        });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Fetch 使用</Text>
        <View style={styles.input_container}>
          <TextInput
            style={styles.input}
            onChangeText={text => {
              this.searchKey = text;
            }}
          />
          <Button
            title={'获取'}
            onPress={() => {
              this.loadDataB();
            }}
          />
        </View>
        <Text>{this.state.showText}</Text>
      </View>
    );
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 30,
    borderColor: 'black',
    borderWidth: 1,
    marginRight: 10,
    padding: 0,
  },
});
