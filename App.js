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
import RandomTest from './views/RandomTest';

const Drawer = createDrawerNavigator();
const db = SQLite.openDatabase(
  {
    name: 'SQLiteQuizTest.db',
    // location: 'default',
    createFromLocation: '~SQLiteQuizTest.db',
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
      id: [],
    };

    const getTests = async () => {
      let Id = [];
      return fetch('http://tgryl.pl/quiz/tests')
        .then((response) => response.json())
        .then((data) => {
          let query =
            'INSERT INTO tests (name, id_tests, description, tags, level, numberOfTasks) VALUES ';
          let testIds = [];
          for (let i = 0; i < data.length; i++) {
            testIds.push(data[i].id);
            query =
              query +
              "('" +
              data[i].name +
              "','" +
              data[i].id +
              "','" +
              data[i].description +
              "','" +
              data[i].tags.join(', ') +
              "','" +
              data[i].level +
              "','" +
              data[i].numberOfTasks +
              "')";
            if (i != data.length - 1) {
              query = query + ',';
            }
            Id.push(data[i].id);
          }
          this.setState({id: Id});
          return query;
        })
        .catch((error) => {
          console.error(error);
        });
    };

    const getQuestions = async (id) => {
      return fetch('http://tgryl.pl/quiz/test/' + id)
        .then((response) => response.json())
        .then((data) => {
          let questionQuery =
            "('" + id + "','" + JSON.stringify(data).replace(/'/g, ' ') + "')";
          // if (i !== id.length) {
          // questionQuery = questionQuery + ',';
          // } else {
          return questionQuery;
          // }
        })
        .catch((error) => {
          console.error(error);
        });
      // }
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
        tx.executeSql('SELECT * from logs ', [], (tx, {rows}) => {
          if (
            rows.length === 0 ||
            rows.item(rows.length - 1).date !== todayDate
          ) {
            tx.executeSql('DELETE FROM tests', [], tx);
            tx.executeSql(query, [], tx);

            loadQuestions().then((questionQuery) => {
              // console.log(questionQuery[questionQuery.length - 1]);
              db.transaction((tx) => {
                tx.executeSql(
                  'INSERT INTO logs (date) VALUES ( ? )',
                  [todayDate],
                  tx,
                );

                tx.executeSql('DELETE FROM questions', [], tx);
                tx.executeSql(questionQuery[questionQuery.length - 1], [], tx);
                console.log('New questions');
              });
            });

            console.log('New categories');
          }
        });
      });
    });

    const loadQuestions = async () => {
      let questionQuery = 'INSERT INTO questions (id_test, question) VALUES ';
      // for (let i = 0; i < this.state.id.length; i++) {
      const loop = this.state.id.map(async (id, i) => {
        return getQuestions(id).then((query) => {
          questionQuery += query;
          if (i !== this.state.id.length - 1) {
            questionQuery += ', ';
          }
          return questionQuery;
        });
      });

      return await Promise.all(loop);
    };
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
            <Drawer.Screen
              name="Test"
              component={Test}
              options={{unmountOnBlur: true}}
            />
            <Drawer.Screen name="Random Test" component={RandomTest} />
          </Drawer.Navigator>
        </NavigationContainer>
      </>
    );
  }
}
