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
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import {Db} from '../service/firebase';
import Footer from '../components/footer';
import ImagePicker from 'react-native-image-picker';

class Profile extends Component {
  state = {
    name: '',
    image: '',
    email: '',
    users: [],
  };

  componentDidMount = () => {
    this.getid();
  };

  getid = async () => {
    try {
      const name = await AsyncStorage.getItem('name');
      const image = await AsyncStorage.getItem('image');
      const email = await AsyncStorage.getItem('email');

      if (name !== null) {
        this.setState({
          name,
          image,
          email,
        });
      }
    } catch (e) {
      console.log(e);
    }
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

  getCamera = () => {
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = {uri: 'data:image/jpeg;base64,' + response.data};

        setImage(response.uri);
        setImgData(source.uri);

        setInterval(function() {
          setImgLoading(true);
        }, 5000);
      }
    });
  };

  logOut = async () => {
    try {
      await AsyncStorage.clear();
      this.props.navigation.navigate('Login');
    } catch (e) {
      // clear error
    }
    console.log('Done.');
  };

  render() {
    const {name, image, email, users} = this.state;
    console.log(email);
    // let filteredUser = users.filter(user => user.id === id);
    console.log(users);

    return (
      <Fragment>
        <Header>
          <Left></Left>
          <Body>
            <Title>Profile</Title>
          </Body>
          <Right></Right>
        </Header>
        <Content>
          <View style={styles.container}>
            <Thumbnail large source={{uri: image}} />
            <View style={{alignSelf: 'flex-start'}}>
              <Text style={{marginTop: 30, fontSize: 18}}>{name}</Text>
              <Text style={{marginVertical: 15, fontSize: 18}}>{email}</Text>
            </View>
            {/* <Button block rounded style={{backgroundColor: '#1abc9c'}}>
              <Text>Update Profile</Text>
            </Button> */}
            <Button
              onPress={() => this.logOut()}
              block
              rounded
              style={{backgroundColor: 'red', marginVertical: 10}}>
              <Text>Log out</Text>
            </Button>
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

// const Profile = () => {
//   const [user, setUser] = useState([]);
//   const [id, setId] = useState('');

// const getid = async () => {
//   try {
//     const value = await AsyncStorage.getItem('id');
//     if (value !== null) {
//       setId(value);
//     }
//   } catch (e) {
//     console.log(e);
//   }
// };

// const getAllUser = async () => {
//   await Db.ref('/users').on('value', result => {
//     let data = result.val();

//     if (data !== null) {
//       let users = Object.values(data);
//       let filteredUser = users.filter(user => user.id === id);
//       console.log(filteredUser);
//       setUser(filteredUser);
//     }
//   });
// };

//   useEffect(() => {
//     getAllUser();
//     getid();
//   }, []);

//   // console.log(user);

//   return (
//     <Fragment>
//       <Header></Header>
//       <Content>
//         <View style={styles.container}>
//           <Thumbnail
//             style={{backgroundColor: 'black', width: 100, height: 100}}
//           />
//           <View style={{alignSelf: 'flex-start'}}>
//             <Text style={{marginTop: 30, fontSize: 18}}>{user.name}</Text>
//             <Text style={{marginVertical: 15, fontSize: 18}}>
//               email@mail.com
//             </Text>
//             <Text style={{fontSize: 18, marginBottom: 15}}>email@mail.com</Text>
//           </View>
//           <Button block rounded style={{backgroundColor: '#1abc9c'}}>
//             <Text>Update Profile</Text>
//           </Button>
//         </View>
//       </Content>
//       <Footer></Footer>
//     </Fragment>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//     alignItems: 'center',
//     marginTop: 15,
//     paddingHorizontal: 20,
//   },
// });

export default Profile;
