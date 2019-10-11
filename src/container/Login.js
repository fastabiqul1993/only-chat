import React, {Fragment, useState, useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Icon, Item, Input, Button, Spinner, Toast} from 'native-base';
import {Db, Auth} from '../service/firebase';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-community/async-storage';

const Login = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({});

  const handleSubmit = async () => {
    setLoading(true);
    Auth.signInWithEmailAndPassword(email, password)
      .then(async result => {
        await Db.ref('users/' + result.user.uid).update({
          status: 'online',
          location,
        });

        let storage = async () => {
          try {
            await AsyncStorage.setItem('id', result.user.uid);
            await AsyncStorage.setItem('name', result.user.displayName);
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('image', result.user.photoURL);
          } catch (e) {
            // saving error
            console.log(e);
          }
        };

        storage();
        setLoading(false);

        props.navigation.navigate('Maps');
      })
      .catch(error => {
        setLoading(false);
        console.log(error);

        Toast.show({
          text: 'Login failed!',
          buttonText: 'Okay',
        });
      });
  };

  const getLocation = async () => {
    await Geolocation.getCurrentPosition(
      position => {
        let {longitude, latitude} = position.coords;

        setLocation({longitude, latitude});
      },
      err => {
        console.log(err.code, err.message);
      },
      {
        showLocationDialog: true,
        distanceFilter: 1,
        enableHighAccuracy: true,
        fastestInterval: 5000,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  const onRegister = () => {
    props.navigation.navigate('Register');
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.logo}>
          <Text style={styles.logoName}>Only</Text>
          <Icon style={styles.logoIcon} type="Ionicons" name="chatboxes" />
        </View>
      </View>
      <View style={styles.body}>
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
        <View>
          <Button
            style={styles.btn}
            full
            rounded
            onPress={() => handleSubmit()}>
            {loading ? (
              <Fragment>
                <Text style={styles.disableBtn}>Have a great day!</Text>
                <Spinner style={styles.loading} color="#e5e5e5" />
              </Fragment>
            ) : (
              <Text style={styles.btnText}>Get Started</Text>
            )}
          </Button>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerTxt}>Don't Have an account?</Text>
        <View style={styles.footerBtn}>
          <Button style={styles.gmailBtn} iconLeft full rounded>
            <Icon type="Ionicons" name="logo-google" />
            <Text style={styles.footerBtnTxtGoogle}>Google</Text>
          </Button>
          <Text style={{margin: '4%'}}>or</Text>
          <Button
            onPress={() => onRegister()}
            style={styles.signupBtn}
            bordered
            full
            rounded>
            <Text style={styles.footerBtnTxt}>Register</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    height: '25%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  logo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  logoName: {
    fontSize: 60,
    color: '#2c3e50',
  },
  logoIcon: {
    fontSize: 45,
    color: '#1abc9c',
  },
  body: {
    height: '50%',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: '10%',
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

export default Login;
