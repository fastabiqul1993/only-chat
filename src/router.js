import React, {Fragment} from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Login from './container/Login';
import Chat from './container/Chat';
import Register from './container/Register';
import Maps from './container/Maps';
import FriendList from './container/FriendList';
import Profile from './container/Profile';
import FriendProfile from './container/FriendProfile';

const AuthStack = createStackNavigator(
  {
    Login,
    Register,
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none',
  },
);

const AppStack = createStackNavigator(
  {
    Chat,
    Maps,
    FriendList,
    Profile,
    FriendProfile,
  },
  {
    initialRouteName: 'Maps',
    headerMode: 'none',
  },
);

const Router = createSwitchNavigator(
  {
    AuthStack,
    AppStack,
  },
  {initialRouteName: 'AuthStack', headerMode: 'none'},
);

export default createAppContainer(Router);
