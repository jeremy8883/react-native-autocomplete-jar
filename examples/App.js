import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import AutocompleteJar from 'react-native-autocomplete-jar';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.root}>
        <Text style={styles.heading}>Autocomplete Example</Text>
        <AutocompleteJar />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    margin: 20,
  },
  heading: {
    fontWeight: 'bold',
  },
});
