import React, {Fragment, useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
  Circle,
  Marker,
  AnimatedRegion,
  Callout,
} from 'react-native-maps';
import {Thumbnail} from 'native-base';
import Footer from '../components/footer';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-community/async-storage';
import {Db} from '../service/firebase';

const Maps = props => {
  const [region, setRegion] = useState({
    latitude: -6.17511,
    longitude: 106.865036,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [users, setUsers] = useState([]);
  const [id, setId] = useState(null);

  const watchLocation = () => {
    Geolocation.getCurrentPosition(
      async position => {
        let Position = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setRegion({
          latitude: Position.latitude,
          longitude: Position.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
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

  const getid = async () => {
    try {
      const value = await AsyncStorage.getItem('id');
      if (value !== null) {
        setId(value);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getAllUser = async () => {
    await Db.ref('/users').on('value', result => {
      let data = result.val();

      if (data !== null) {
        let users = Object.values(data);
        setUsers(users);
      }
    });
  };

  useEffect(() => {
    watchLocation();
    getAllUser();
    getid();
  }, []);

  console.log(id);

  return (
    <Fragment>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.container}
        showsCompass={true}
        zoomControlEnabled={true}
        showsUserLocation={true}
        followsUserLocation={true}
        region={region}
        initialRegion={region}>
        {users.length > 0
          ? users.map((item, index) => (
              <MapView.Marker
                key={index}
                title={item.id === id ? 'You' : item.name}
                description={
                  item.id === id
                    ? ''
                    : `${item.location.latitude} | ${item.location.longitude}`
                }
                coordinate={{
                  latitude: item.location.latitude,
                  longitude: item.location.longitude,
                }}>
                <TouchableOpacity>
                  <Thumbnail small source={{uri: item.image}} />
                </TouchableOpacity>
              </MapView.Marker>
            ))
          : null}
      </MapView>
      <Footer props={props} />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Maps;
