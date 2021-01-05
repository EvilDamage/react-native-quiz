/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from 'react-native';
import {Table, Row, Rows} from 'react-native-table-component';
import NavBar from '../components/NavBar';

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export default class Result extends React.Component {
  constructor() {
    super();
    this.state = {
      HeadTable: ['Nick', 'Points', 'Type', 'Date'],
      refreshing: false,
      items: '',
      // DataTable: [
      //   ['nick', '18/20', 'test1', '12-03-2007'],
      //   ['nick', '18/20', 'test1', '12-03-2007'],
      //   ['nick', '18/20', 'test1', '12-03-2007'],
      //   ['nick', '18/20', 'test1', '12-03-2007'],
      // ],
    };
  }

  renderItem = ({item}) => {
    const {nick, score, total, type, date} = item;
    return (
      <Row
        data={[nick, score + '/' + total, type, date]}
        style={styles.ItemStyle}
        borderStyle={{borderWidth: 1, borderColor: 'grey'}}
        textStyle={styles.TableText}
      />
    );
  };

  handleOnRefresh = () => {
    this.setState(
      {
        refreshing: true,
      },
      () => {
        wait(2000).then(() => this.setState({refreshing: false}));
      },
    );
  };

  componentDidMount() {
    return fetch('http://tgryl.pl/quiz/results?last=25')
      .then((response) => response.json())
      .then((json) => {
        this.setState({items: json.reverse()});
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <View style={{flex: 1, height: 100}}>
        <NavBar title={'Results'} navigation={this.props.navigation} />
        <View style={styles.container}>
          <Table>
            <Row
              data={this.state.HeadTable}
              style={styles.HeadStyle}
              textStyle={styles.TableText}
            />
            <SafeAreaView>
              <FlatList
                data={this.state.items}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleOnRefresh}
                  />
                }
              />
            </SafeAreaView>
          </Table>
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
  HeadStyle: {
    height: 50,
    alignContent: 'center',
    backgroundColor: '#b9b9b9',
  },
  ItemStyle: {
    height: 50,
    alignContent: 'center',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: 'grey',
  },
  TableText: {
    margin: 10,
  },
});
