/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  TextInput,
} from 'react-native';
import * as Progress from 'react-native-progress';

import NavBar from '../components/NavBar';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({
  name: 'SQLiteQuizTest.db',
  createFromLocation: '~SQLiteQuizTest.db',
});

class Test extends React.Component {
  constructor(props: Object) {
    super(props);
    this.state = {
      timer: 30,
      currentTask: 0,
      points: 0,
      quests: {},
      isLoadedTest: false,
      name: '',
    };
  }

  componentDidMount() {
    this.interval = setInterval(
      () => this.setState((prevState) => ({timer: prevState.timer - 1})),
      1000,
    );

    this.props.navigation.addListener('focus', () => {
      this.setState(() => ({
        currentTask: 0,
        points: 0,
        quests: {},
        isLoadedTest: false,
      }));
    });

    console.log(this.state.currentTask)

    db.transaction((tx) => {
      tx.executeSql('SELECT * from questions', [], (tx, {rows}) => {
        console.log(rows);
        for (let i = 0; i < rows.length; i++) {
          if (rows.item(i).id_test == this.props.route.params.questId) {
            this.setState({
              quests: JSON.parse(rows.item(i).question),
              isLoadedTest: true,
              timer: 30,
            });
            // console.log(JSON.parse(rows.item(i).question));
          }
        }
      });
    });
    // fetch('http://tgryl.pl/quiz/test/' + this.props.route.params.questId)
    //   .then((response) => response.json())
    //   .then((json) => {
    //     console.log(json)
    //     this.setState({
    //       quests: json,
    //       isLoadedTest: true,
    //       timer: json.tasks[this.state.currentTask].duration,
    //     });
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  }

  componentDidUpdate() {
    if (this.state.timer === 0) {
      this.setState((prevState) => ({
        currentTask: prevState.currentTask + 1,
        timer: 30,
      }));
    }
  }

  answer = (isCorrect) => {
    if (isCorrect) {
      this.setState((prevState) => ({
        timer: this.state.quests.tasks[prevState.currentTask].duration,
        points: prevState.points + 1,
        currentTask: prevState.currentTask + 1,
      }));
    } else {
      this.setState((prevState) => ({
        timer: this.state.quests.tasks[prevState.currentTask].duration,
        currentTask: prevState.currentTask + 1,
      }));
    }
  };

  handleChange = (nick) => {
    this.setState({
      name: nick,
    });
  };

  handleSubmit = () => {
    const object = {
      nick: this.state.name,
      score: this.state.points,
      total: this.state.quests.tasks.length,
      type: this.state.quests.tags.join(', '),
    };

    fetch('http://tgryl.pl/quiz/result', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(object),
    });

    this.props.navigation.navigate('Result');
  };

  render() {
    const quests = this.state.quests;
    return (
      <View style={{flex: 1, height: 100}}>
        <NavBar title={'Test'} navigation={this.props.navigation} />
        {this.state.isLoadedTest &&
        this.state.currentTask < quests.tasks.length ? (
          <View style={{padding: 25}}>
            <View style={styles.textRow}>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={styles.boldText}>
                  Question {this.state.currentTask + 1} of {quests.tasks.length}
                </Text>
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={styles.boldText}>
                  Time: {this.state.timer} sec
                </Text>
              </View>
            </View>
            <View style={{alignItems: 'center'}}>
              <Progress.Bar
                progress={this.state.timer / 30}
                width={300}
                height={14}
                style={{marginBottom: 25, marginTop: 25}}
              />
              <Text style={{marginBottom: 15, fontSize: 20}}>
                {quests.tasks[this.state.currentTask].question}
              </Text>
            </View>
            <View style={styles.answersBox}>
              {quests.tasks[this.state.currentTask].answers.map(
                (answer, number) => (
                  <TouchableOpacity
                    key={number}
                    onPress={() => this.answer(answer.isCorrect)}>
                    <Text style={styles.button}>{answer.content}</Text>
                  </TouchableOpacity>
                ),
              )}
            </View>
          </View>
        ) : (
          <View style={{padding: 25}}>
            <View style={styles.textRow}>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={styles.result}>Congratulations!</Text>
                <Text style={styles.points}>
                  You got: {this.state.points} points
                </Text>
                <TextInput
                  style={{
                    height: 40,
                    width: 300,
                    marginTop: 20,
                    marginBottom: 20,
                    borderColor: 'gray',
                    borderWidth: 1,
                  }}
                  value={this.state.name}
                  onChangeText={(value) => this.handleChange(value)}
                />
                <Button title="Check the results" onPress={this.handleSubmit} />
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  result: {
    fontSize: 32,
    marginBottom: 15,
  },
  points: {
    fontSize: 24,
    marginBottom: 15,
  },
  boldText: {
    fontWeight: 'bold',
  },
  textRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  answersBox: {
    borderWidth: 2,
    borderColor: 'black',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
    marginTop: 15,
  },
  button: {
    borderWidth: 2,
    borderColor: 'black',
    textAlign: 'center',
    width: 150,
    padding: 10,
    margin: 10,
    backgroundColor: 'lightgrey',
  },
});
export default Test;
