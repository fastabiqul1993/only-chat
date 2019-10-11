import React, {Fragment, Component} from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import {
  Thumbnail,
  Header,
  Left,
  Right,
  Body,
  Title,
  Content,
  Text,
} from 'native-base';
import {Db} from '../service/firebase';
import Footer from '../components/footer';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

class FriendList extends Component {
  state = {
    users: [],
    id: '',
  };

  componentDidMount = async () => {
    await this.getAllUser();
    await this.getName();
  };

  getAllUser = () => {
    Db.ref('/users').on('value', result => {
      let data = result.val();

      if (data !== null) {
        let users = Object.values(data);
        this.setState({users});
      }
    });
  };

  getName = async () => {
    try {
      const value = await AsyncStorage.getItem('id');
      if (value !== null) {
        this.setState({id: value});
      }
    } catch (e) {
      console.log(e);
    }
  };

  onChatting = item => {
    this.props.navigation.navigate('Chat', item);
  };
  render() {
    const {users, id} = this.state;

    const filteredUser = this.state.users.filter(
      user => user.id !== this.state.id,
    );

    return (
      <Fragment>
        <Header>
          <Left></Left>
          <Body>
            <Title>Friends</Title>
          </Body>
          <Right></Right>
        </Header>
        <Content>
          <FlatList
            data={filteredUser}
            numColumns={1}
            renderItem={({item}) => {
              return (
                <TouchableOpacity onPress={() => this.onChatting(item)}>
                  <View
                    style={{
                      marginHorizontal: 10,
                      borderColor: '#e5e5e5',
                      borderBottomWidth: 1,
                    }}>
                    <View style={{marginVertical: 10, flexDirection: 'row'}}>
                      <Thumbnail source={{uri: item.image}} />
                      <Text
                        style={{
                          marginVertical: 18,
                          marginHorizontal: 10,
                          fontWeight: 'bold',
                        }}>
                        {item.name}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </Content>
        <Footer props={this.props} />
      </Fragment>
    );
  }
}

// const FriendList = props => {
//   const [users, setUsers] = useState([]);
//   const [filterUser, setFilterUser] = useState([]);
//   const [uid, setUid] = useState('');

//   const getAllUser = async () => {
//     await Db.ref('/users').on('value', result => {
//       let data = result.val();

//       if (data !== null) {
//         let users = Object.values(data);
//         setUsers(users);
//       }
//     });
//   };

//   const getName = async () => {
//     const filteredUser = await users.filter(user => user.name !== uid);
//     setFilterUser(filteredUser);
//     try {
//       const value = await AsyncStorage.getItem('name');
//       if (value !== null) {
//         setUid(value);
//       }
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   const onChatting = item => {
//     props.navigation.navigate('Chat', item);
//   };

//   useEffect(() => {
//     getAllUser();
//     getName();
//   }, []);

//   console.log(users);

// return (
//   <Fragment>
//     <Header>
//       <Left></Left>
//       <Body>
//         <Title>Friends</Title>
//       </Body>
//       <Right></Right>
//     </Header>
//     <Content>
//       <FlatList
//         data={filterUser}
//         numColumns={1}
//         renderItem={({item}) => {
//           return (
//             <TouchableOpacity onPress={() => onChatting(item)}>
//               <View
//                 style={{
//                   marginHorizontal: 10,
//                   borderColor: '#e5e5e5',
//                   borderBottomWidth: 1,
//                 }}>
//                 <View style={{marginVertical: 10, flexDirection: 'row'}}>
//                   <Thumbnail source={{uri: item.image}} />
//                   <Text
//                     style={{
//                       marginVertical: 18,
//                       marginHorizontal: 10,
//                       fontWeight: 'bold',
//                     }}>
//                     {item.name}
//                   </Text>
//                 </View>
//               </View>
//             </TouchableOpacity>
//           );
//         }}
//       />
//     </Content>
//     <Footer props={props} />
//   </Fragment>
// );
// };

export default FriendList;
