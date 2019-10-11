/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';
import {Root} from 'native-base';
import Router from './router';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Login from './container/Login';
import Chat from './container/Chat';
import Register from './container/Register';
import Maps from './container/Maps';
import FriendList from './container/FriendList';
import Profile from './container/Profile';
import Footer from './components/footer';

const App = () => {
  return (
    <Fragment>
      <Root>
        <Router />
      </Root>
    </Fragment>
  );
};

console.disableYellowBox = true;

export default App;
