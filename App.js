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
import SQLite from 'react-native-sqlite-storage';

import Home from './views/Home';
import Test from './views/Test';
import Result from './views/Result';
import Modal from './components/Modal';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';

const Drawer = createDrawerNavigator();
const db = SQLite.openDatabase(
  {
    name: 'SQLiteQuiz.db',
    // location: 'default',
    createFromLocation: '~SQLiteQuiz.db',
  },
  () => {
    console.log('SQLite connected');
  },
  (error) => {
    console.log('ERROR: ' + error);
  },
);

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      query: {},
    };

    const getTests = async () => {
      return fetch('http://tgryl.pl/quiz/tests')
        .then((response) => response.json())
        .then((data) => {
          let query =
            'INSERT INTO tests (name, id_tests, description, tags, level, numberOfTasks) VALUES ';
          for (let i = 0; i < data.length; i++) {
            query =
              query +
              "('" +
              data[i].name +
              "','" +
              data[i].id +
              "','" +
              data[i].description +
              "','" +
              data[i].level +
              "','" +
              data[i].tags +
              "','" +
              data[i].numberOfTasks +
              "')";
            if (i != data.length - 1) {
              query = query + ',';
            }
          }
          return query;
        })
        .catch((error) => {
          console.error(error);
        });
    };

    getTests().then((query) => {
      db.transaction((tx) => {
        const today = new Date();
        const todayDate =
          today.getDate() +
          '-' +
          parseInt(today.getMonth() + 1) +
          '-' +
          today.getFullYear();
        tx.executeSql('SELECT * from logs', [], (tx, {result}) => {
          if (result.length !== 0 || result.item(result.length) !== todayDate) {
            tx.executeSql('DELETE FROM tests', [], tx);
            tx.executeSql(query, [], tx);
            tx.executeSql(
              'INSERT INTO logs (date) VALUES (?)',
              [todayDate],
              tx,
            );
          }
        });
      });
    });
  }

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
