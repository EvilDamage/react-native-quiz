import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import NetInfo from '@react-native-community/netinfo';

const NavBar = ({title, navigation}) => {
  const [internetStatus, setinternetStatus] = useState(true);

  NetInfo.fetch().then((netInfo) => {
    setinternetStatus(netInfo.isConnected);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      NetInfo.fetch().then((netInfo) => {
        setinternetStatus(netInfo.isConnected);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View>
      <View style={styles.wrapper}>
        <Icon
          name="bars"
          size={30}
          color="#fff"
          onPress={() => navigation.toggleDrawer()}
        />
        <Text style={styles.text}>{title}</Text>
      </View>
      {!internetStatus ? (
        <View style={styles.netInfo}>
          <Text style={styles.netInfoText}>No internet connection</Text>
        </View>
      ) : (
        <View />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#aaaaaa',
    padding: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  text: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 24,
    paddingLeft: 32,
  },
  netInfo: {
    color: '#ffffff',
    backgroundColor: '#aa0c18',
    height: 30,
  },
  netInfoText: {
    color: '#ffffff',
    textAlign: 'center',
    paddingTop: 3,
    fontSize: 16,
  },
});

export default NavBar;
