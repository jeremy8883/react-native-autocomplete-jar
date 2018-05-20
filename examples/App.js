import React from 'react';
import {
  FlatList,
  Text,
  TextInput, TouchableOpacity,
  View
} from 'react-native';

import AutocompleteJar from 'react-native-autocomplete-jar';
import { styles } from './styles';
import * as fakeApi from './fakeApi';

export default class App extends React.Component {
  _renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => { console.log(item.id) }}
      style={styles.item}
    >
      <Text style={styles.itemText}>
        { item.text }
      </Text>
    </TouchableOpacity>
  )

  _renderSeparator = () => (<View style={styles.separator} />);

  _keyExtractor = ({ id }) => id

  _renderAutocomplete = ({ onChangeText, value, result }) => {
    const { status, data, error } = result;

    return (
      <View>
        <TextInput
          onChangeText={onChangeText}
          value={value}
          placeholder="Type something!"
          returnKeyType="done"
          style={styles.textInput}
        />
        { status === 'LOADING' ? (
          <View style={styles.item}>
            <Text style={styles.itemTextMuted}>Searching...</Text>
          </View>
        ) : status === 'ERROR' ? (
          <View style={styles.item}>
            <Text style={styles.itemTextError}>
              There was a problem getting your results
            </Text>
          </View>
        ) : status === 'SUCCESS' && !data.length ? (
          <View style={styles.autocompleteInfo}>
            <Text style={styles.itemTextMuted}>
              No results could be found. { error.message }
            </Text>
          </View>
        ) : status === 'SUCCESS' ? (
          <FlatList
            data={data}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            ItemSeparatorComponent={this._renderSeparator}
            // Needed, otherwise the user will need to tap the item twice
            // for the onPress to call
            keyboardShouldPersistTaps="handled"
          />
        ) : null
        }
      </View>
    );
  }

  render() {
    return (
      <View style={styles.root}>
        <Text style={styles.heading}>Autocomplete Example</Text>

        <AutocompleteJar fetchResults={fakeApi.fetchResults}>
          {this._renderAutocomplete}
        </AutocompleteJar>
      </View>
    );
  }
}
