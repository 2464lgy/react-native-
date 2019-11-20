import React from 'react';
import {TouchableOpacity, View, Text, Image, StyleSheet} from 'react-native';
import HTMLView from 'react-native-htmlview';
import BaseItem from './BaseItem';
export default class TrendingItem extends BaseItem {
  render() {
    const {projectModel} = this.props;
    const {item} = projectModel;
    if (!item) return null;
    let description = '<p>' + item.description + '</p>';
    return (
      <TouchableOpacity onPress={this.props.onSelect}>
        <View style={styles.cell_container}>
          <Text style={styles.title}>{item.fullName}</Text>
          <HTMLView
            value={description}
            onLinkPress={url => {}}
            stylesheet={{
              p: styles.description,
              a: styles.description,
            }}
          />
          <HTMLView value={item.meta} stylesheet={styles.description} />

          <View style={styles.row}>
            <View style={styles.row}>
              <Text>Built by:</Text>
              {item.contributors.map((result, i, arr) => {
                return (
                  <Image
                    style={{height: 22, width: 22, margin: 2}}
                    source={{uri: arr[i]}}
                    key={i}
                  />
                );
              })}
            </View>

            {this._favoriteIcon()}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  cell_container: {
    backgroundColor: 'white',
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 3,
    borderColor: '#dddddd',
    borderWidth: 0.5,
    borderRadius: 2,
    //shadow设置阴影仅对iOS有效
    shadowColor: 'gray',
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.4,
    shadowRadius: 0.1,
    //elevation设置阴影仅对android有效
    elevation: 2,
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
    color: '#212121',
  },
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    marginBottom: 2,
    color: '#757575',
  },
});
