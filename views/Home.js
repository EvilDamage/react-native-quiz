/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import NavBar from '../components/NavBar';
import QuizItem from '../components/QuizItem';
import Footer from '../components/Footer';
import SQLite from 'react-native-sqlite-storage';
const _ = require('lodash');

const db = SQLite.openDatabase({
  name: 'SQLiteQuiz.db',
  createFromLocation: '~SQLiteQuiz.db',
});

class Home extends React.Component {
  constructor(props: Object) {
    super(props);
    this.state = {
      // quests,
      isLoadedTest: false,
    };
  }

  componentDidMount() {
    return db.transaction((tx) => {
      tx.executeSql('SELECT * from tests', [], (tx, {rows}) => {
        let items = [];
        console.log('Ilosc rows: ' + rows.length);
        for (let i = 0; i < rows.length; i++) {
          items.push(rows.item(i));
        }
        // console.log(items);
        this.setState({quests: _.shuffle(items), isLoadedTest: true});
      });
    });

    // return fetch('http://tgryl.pl/quiz/tests')
    //   .then((response) => response.json())
    //   .then((json) => {
    //     console.log(json)
    //     this.setState({quests: _.shuffle(json), isLoadedTest: true});
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  }

  render() {
    return (
      <View style={{flex: 1, height: 100}}>
        <StatusBar barStyle="dark-content" />
        <NavBar title={'Home Page'} navigation={this.props.navigation} />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          {this.state.isLoadedTest ? (
            this.state.quests.map((quest, number) => (
              <TouchableOpacity
                key={number}
                onPress={() => {
                  this.props.navigation.navigate('Test', {questId: quest.id});
                }}>
                <QuizItem quest={quest} />
              </TouchableOpacity>
            ))
          ) : (
            <View />
          )}
          <Footer navigation={this.props.navigation} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {},
});

export default Home;
