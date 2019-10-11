import React, {Fragment, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import {Auth, Db} from '../service/firebase';
import {Icon, Item, Input, Button, Spinner, Toast} from 'native-base';
import ImagePicker from 'react-native-image-picker';
import {ScrollView} from 'react-native-gesture-handler';

const Register = props => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');
  const [imgData, setImgData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  const options = {
    title: 'Select Photo',
    tintColor: '#1abc9c',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const getCamera = () => {
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

  const uploadImg = async () => {
    setLoading(true);
    const data = new FormData();
    data.append('file', imgData);
    data.append('upload_preset', 'flrmjsat');

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/dtylbqd7w/image/upload',
      {
        method: 'POST',
        body: data,
      },
    );

    const file = await res.json();

    await Auth.createUserWithEmailAndPassword(email, password)
      .then(async result => {
        var userPro = Auth.currentUser;
        userPro.updateProfile({
          displayName: name,
          photoURL: file.secure_url,
        });
        await Db.ref('users/' + result.user.uid)
          .set({
            id: result.user.uid,
            name: name,
            email: email,
            password: password,
            image: file.secure_url,
          })
          .then(() => {
            setLoading(false);
            Toast.show({
              text: 'Register Succes!',
              buttonText: 'OK',
            });
            props.navigation.navigate('Login');
          });
      })
      .catch(error => {
        setLoading(false);
        Toast.show({
          text: `${error.code}`,
          buttonText: 'OK',
        });
      });
  };

  return (
    <ScrollView style={{height: '100%', width: '100%'}}>
      <View style={styles.container}>
        <View style={styles.top}>
          <View style={styles.logo}>
            <Text style={styles.logoName}>Register</Text>
          </View>
        </View>
        <View style={styles.body}>
          {image ? (
            <Image style={styles.imgDummy} source={{uri: image}} />
          ) : (
            <TouchableOpacity
              onPress={() => getCamera()}
              style={styles.imgDummy}>
              {imgLoading ? (
                <Spinner color="#1abc9c" style={{margin: 0, padding: 0}} />
              ) : (
                <Text style={styles.imgDummyText}>+</Text>
              )}
            </TouchableOpacity>
          )}
          <Item style={styles.box} rounded>
            <Input
              onChangeText={name => setName(name)}
              placeholder="Enter name"
            />
          </Item>
          <Item style={styles.box} rounded>
            <Input
              onChangeText={email => setEmail(email)}
              placeholder="Enter email"
            />
          </Item>
          <Item style={styles.box} rounded>
            <Input
              onChangeText={password => setPassword(password)}
              placeholder="Enter password"
              secureTextEntry={true}
            />
          </Item>
        </View>
        <View style={styles.footer}>
          <View>
            <Button style={styles.btn} full rounded onPress={() => uploadImg()}>
              {loading ? (
                <Fragment>
                  <Text style={styles.disableBtn}>Please wait!</Text>
                  <Spinner style={styles.loading} color="#e5e5e5" />
                </Fragment>
              ) : (
                <Text style={styles.btnText}>Register</Text>
              )}
            </Button>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    height: '25%',
    marginVertical: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  logo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  logoName: {
    marginHorizontal: '10%',
    fontSize: 45,
    color: '#2c3e50',
  },
  body: {
    height: '50%',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: '10%',
  },
  box: {
    marginVertical: 25,
  },
  imgDummy: {
    width: '32%',
    height: '32%',
    backgroundColor: '#e5e5e5',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 45,
  },
  imgDummyText: {
    fontWeight: 'normal',
    fontSize: 24,
    color: '#2c3e50',
  },
  btn: {
    backgroundColor: '#1abc9c',
  },
  gmailBtn: {
    backgroundColor: '#e74c3c',
  },
  signupBtn: {
    borderColor: '#1abc9c',
  },
  loading: {
    color: '#34495e',
  },
  disableBtn: {
    paddingHorizontal: '5%',
    paddingVertical: 0,
    color: '#fff',
    fontSize: 18,
    zIndex: 1,
  },
  btnText: {
    paddingHorizontal: '20%',
    paddingVertical: 0,
    color: '#fff',
    fontSize: 18,
    zIndex: 1,
  },
  footer: {
    height: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerTxt: {
    fontSize: 14,
    marginBottom: '5%',
    color: '#2c3e50',
  },
  footerDivider: {
    margin: '4%',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  footerBtn: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  footerBtnTxtGoogle: {
    paddingHorizontal: '4%',
    paddingVertical: 0,
    color: '#fff',
  },
  footerBtnTxt: {
    paddingHorizontal: '8%',
    paddingVertical: 0,
    color: '#1abc9c',
    fontSize: 14,
  },
});

export default Register;
