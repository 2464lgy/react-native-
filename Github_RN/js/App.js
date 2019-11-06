import React from 'react';
import {Provider} from 'react-redux';
import AppNavigator from './navigator/AppNavigators';
import store from './store';
export default class App extends React.Component {
  render() {
    /**
     *3将store传递给App的整个框架
     */
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );
  }
}
