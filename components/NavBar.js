import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const NavBar = ({title, navigation}) => {
  return (
    <View style={styles.wrapper}>
      <Icon
        name="bars"
        size={30}
        color="#fff"
        onPress={() => navigation.toggleDrawer()}
      />
      <Text style={styles.text}>{title}</Text>
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
});

export default NavBar;
