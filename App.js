/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import 'react-native-gesture-handler';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {getData, storeData} from './storage/AsyncStorage';

import Home from './views/Home';
import Test from './views/Test';
import Result from './views/Result';
import Modal from './components/Modal';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';

const Drawer = createDrawerNavigator();

export default class App extends React.Component {
  state = {
    modalVisible: false,
  };

  componentDidMount() {
    getData()
      .then((data) => data !== 'MODAL')
      .then((data) => this.setState({modalVisible: data}));
    SplashScreen.hide();
  }

  handleAcceptRules = () => {
    storeData('MODAL').then(() => this.setState({modalVisible: false}));
  };

  render() {
    const {modalVisible} = this.state;
    return (
      <>
        <Modal visible={modalVisible} onPress={this.handleAcceptRules} />
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Result" component={Result} />
            <Drawer.Screen name="Test" component={Test} />
          </Drawer.Navigator>
        </NavigationContainer>
      </>
    );
  }
}
