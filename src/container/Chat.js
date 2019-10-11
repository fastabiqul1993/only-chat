import React, {Component} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage,
  Text,
} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {
  Header,
  Left,
  Right,
  Body,
  Title,
  Spinner,
  Button,
  Icon,
} from 'native-base';
import {Db} from '../service/firebase';
import firebase from 'firebase';

class Chat extends Component {
  state = {
    id: this.props.navigation.state.params.id,
    name: this.props.navigation.state.params.name,
    image: this.props.navigation.state.params.image,
    status: this.props.navigation.state.params.status,
    messages: [],
    text: '',
    isLoading: true,
  };

  componentDidMount = async () => {
    const myid = await AsyncStorage.getItem('id');
    const myname = await AsyncStorage.getItem('name');
    const avatar = await AsyncStorage.getItem('image');
    this.setState({myid, myname, avatar});
    Db.ref('messages')
      .child(this.state.myid)
      .child(this.state.id)
      .on('child_added', val => {
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, val.val()),
        }));
      });
    this.setState({isLoading: false});
  };

  goToFriend = () => {
    this.props.navigation.navigate('FriendProfile', {
      name: this.state.name,
      image: this.state.image,
    });
  };

  sendMessage = async () => {
    if (this.state.text.length > 0) {
      let msgId = Db.ref('messages')
        .child(this.state.myid)
        .child(this.state.id)
        .push().key;
      let updates = {};
      let message = {
        _id: msgId,
        text: this.state.text,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        user: {
          _id: this.state.myid,
          name: this.state.myname,
          avatar: this.state.avatar,
        },
      };
      updates[
        `messages/${this.state.myid}/${this.state.id}/${msgId}`
      ] = message;
      updates[
        `messages/${this.state.id}/${this.state.myid}/${msgId}`
      ] = message;
      Db.ref().update(updates);
      this.setState({text: ''});
    }
  };

  render() {
    return (
      <>
        <Header>
          <Left>
            <Button
              onPress={() => this.props.navigation.navigate('FriendList')}
              transparent>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{this.state.name}</Title>
          </Body>
          <Right>
            <TouchableOpacity onPress={() => this.goToFriend()}>
              <Text>Info</Text>
            </TouchableOpacity>
          </Right>
        </Header>
        {this.state.isLoading ? (
          <View style={styles.load}>
            <Spinner color="blue" />
          </View>
        ) : (
          <GiftedChat
            messages={this.state.messages}
            onSend={this.sendMessage}
            showAvatarForEveryMessage={true}
            user={{
              _id: this.state.myid,
              name: this.state.myname,
              avatar: this.state.avatar,
            }}
            onInputTextChanged={value => this.setState({text: value})}
          />
        )}
      </>
    );
  }
}
const styles = StyleSheet.create({
  title: {
    fontSize: 19,
  },
  backAr: {
    paddingLeft: 10,
  },
  iconAr: {
    color: 'white',
  },
  load: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '50%',
  },
});

export default Chat;
