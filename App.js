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
    name: 'SQLiteTests.db',
    // location: 'default',
    createFromLocation: '~www/SQLiteTests.db',
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
    };

    db.transaction((tx) => {
      tx.executeSql('SELECT * from logs', [], (tx, {rows}) => {
        const today = new Date();
        const todayDate =
          today.getDate() +
          '-' +
          parseInt(today.getMonth() + 1) +
          '-' +
          today.getFullYear();

        if (rows.length != 0 || rows.item(rows.length - 1) == todayDate) {
          let query =
            'INSERT INTO testes (name, id_tests, description, tags, level, numberOfTasks) VALUES';

          fetch('http://tgryl.pl/quiz/tests')
            .then((response) => response.json())
            .then((json) => {
              this.setState({quests: json, isLoadedTest: true});
              for (let i = 0; i < this.state.quests.length; ++i) {
                query =
                  query +
                  "('" +
                  this.state.quests[i].name +
                  "','" +
                  this.state.quests[i].id +
                  "','" +
                  this.state.quests[i].description +
                  "','" +
                  this.state.quests[i].level +
                  "','" +
                  this.state.quests[i].tags +
                  "','" +
                  this.state.quests[i].numberOfTasks +
                  "')";
                if (i != this.state.quests.length - 1) {
                  query = query + ',';
                }
              }
            })
            .catch((error) => {
              console.error(error);
            });

          tx.executeSql(query, [], tx);
          tx.executeSql('INSERT INTO logs (date) VALUES (?)', [todayDate], tx);
          console.log('data1');
        } else {
          console.log('!data');
        }
      });
    });
  }

  componentDidMount() {
    getData()
      .then((data) => data !== 'MODAL')
      .then((data) => this.setState({modalVisible: data}));

    SplashScreen.hide();

    fetch('http://tgryl.pl/quiz/tests')
      .then((response) => response.json())
      .then((json) => {
        this.setState({quests: json, isLoadedTest: true});
      })
      .catch((error) => {
        console.error(error);
      });
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
