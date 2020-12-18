import React from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';

const Footer = ({navigation}) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.text}>Get to know your ranking result</Text>
      <Button
        title="Check the results"
        onPress={() => navigation.navigate('Result')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    margin: 10,
    padding: 10,
    borderWidth: 2,
    borderColor: 'black',
  },
  text: {
    fontSize: 25,
    paddingBottom: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default Footer;
