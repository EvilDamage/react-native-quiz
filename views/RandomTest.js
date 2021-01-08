/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';
import NavBar from '../components/NavBar';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({
  name: 'SQLiteQuizTest.db',
  createFromLocation: '~SQLiteQuizTest.db',
});
export default class RandomTest extends React.Component {
  handleDownload = () => {
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
                console.log('New data downloaded1');
              });
            });

            console.log('New data downloaded');
          }
        });
      });
    });
  }

  handleTest = () => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * from tests', [], (tx, {rows}) => {
        this.props.navigation.navigate('Test', {
          questId: rows.item(Math.floor(Math.random() * rows.length) + 1).id_tests,
        });
      });
    });
  }

  render() {
    return (
      <View style={{flex: 1, height: 100}}>
        <NavBar title={'Results'} navigation={this.props.navigation} />
        <View style={styles.container}>
          <Text style={styles.text}>Get random test</Text>
          <Button title="Shuffle!" onPress={this.handleTest} />
        </View>
        <View style={styles.container}>
          <Button title="Download Tests" onPress={this.handleDownload} />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    paddingTop: 35,
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 32,
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 25,
  },
});
