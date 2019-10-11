import React, {Fragment, useState} from 'react';
import {Footer, FooterTab, Button} from 'native-base';
import {Text} from 'react-native';

const footer = props => {
  const onMaps = () => {
    props.props.navigation.navigate('Maps');
  };

  const onFriendList = () => {
    props.props.navigation.navigate('FriendList');
  };

  const onProfile = () => {
    props.props.navigation.navigate('Profile');
  };

  return (
    <Fragment>
      <Footer>
        <FooterTab>
          <Button onPress={() => onMaps()}>
            <Text>Maps</Text>
          </Button>
          <Button onPress={() => onFriendList()}>
            <Text>Friends</Text>
          </Button>
          <Button onPress={() => onProfile()}>
            <Text>Profile</Text>
          </Button>
        </FooterTab>
      </Footer>
    </Fragment>
  );
};

export default footer;
