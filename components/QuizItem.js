import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

class QuizItem extends React.Component {
  render() {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.title}>{this.props.quest.name}</Text>
        <Text style={styles.tag}>
          {/*{this.props.quest.tags.map((tag, number) =>*/}
          {/*  number + 1 !== this.props.quest.tags.length ? tag + ', ' : tag,*/}
          {/*)}*/}
        </Text>
        <Text style={styles.description}>{this.props.quest.description}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    margin: 10,
    padding: 10,
    borderWidth: 2,
    borderColor: 'black',
  },
  title: {
    fontSize: 25,
    paddingBottom: 10,
    fontFamily: "BebasNeue-Regular",
  },
  tag: {
    fontSize: 16,
    paddingBottom: 10,
    color: 'blue',
  },
  description: {
    fontSize: 16,
    color: '#222',
    fontFamily: "NunitoSans-Regular",
  },
});

export default QuizItem;
