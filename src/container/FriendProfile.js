import React, {Fragment, useState, useEffect, Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Thumbnail,
  Header,
  Content,
  Text,
  Button,
  Left,
  Right,
  Body,
  Title,
  Icon,
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import {Db} from '../service/firebase';
import Footer from '../components/footer';
import ImagePicker from 'react-native-image-picker';

class FriendProfile extends Component {
  state = {
    name: this.props.navigation.getParam('name'),
    image: this.props.navigation.getParam('image'),
  };

  render() {
    const {name, image} = this.state;
    return (
      <Fragment>
        <Header>
          <Left>
            <Button onPress={() => this.props.navigation.goBack()} transparent>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Profile</Title>
          </Body>
          <Right></Right>
        </Header>
        <Content>
          <View style={styles.container}>
            <Thumbnail large source={{uri: image}} />
            <View style={{alignSelf: 'center'}}>
              <Text style={{marginTop: 30, fontSize: 18, fontWeight: 'bold'}}>
                {name}
              </Text>
            </View>
          </View>
        </Content>
        <Footer props={this.props} />
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 20,
  },
});

export default FriendProfile;
