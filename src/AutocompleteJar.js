import React, { PureComponent } from 'react';

type Props = {
  children: ({
    onChangeText: (text) => void,
    value: string,
    clearText: () => void,
    data: [any],
  }) => React.Component,
  value: ?string,
};

const empty = { status: 'EMPTY' };

export default class AutocompleteJar extends PureComponent<Props> {
  state = {
    results: {},
    value: '',
  }

  componentWillReceiveProps(newProps, newState) {
    const oldValue = this._getValue(this.props, this.state);
    const newValue = this._getValue(newProps, newState);
    if (oldValue !== newValue) {
      this._fetchResults(newValue);
    }
  }

  componentWillUnmount() {
    this._isUnmounted = true;
  }

  _isUnmounted = false

  _onChangeText = (text) => {
    const { onChangeText } = this.props;

    this.setState({
      value: text,
    });

    if (onChangeText) onChangeText(text);
  }

  _fetchResults = (value) => {
    const resultData = this.state.results[value];
    if (value && (!resultData || typeof resultData === 'string')) {
      this.setState({
        results: {
          ...this.state.results,
          [value]: { status: 'LOADING' },
        },
      });

      const { fetchResults } = this.props;
      fetchResults(value)
        .then((data) => {
          if (this._isUnmounted) return;

          this.setState({
            results: {
              ...this.state.results,
              [value]: { status: 'SUCCESS', data },
            },
          });

          const { onResultsFetched } = this.props;
          if (onResultsFetched) {
            onResultsFetched(data);
          }
        })
        .catch(error => {
          this.setState({
            results: {
              ...this.state.results,
              [value]: { status: 'ERROR', error },
            },
          });
        });
    }
  }

  _handleClearText = () => {
    const { onChangeText } = this.props;

    this.setState({
      value: '',
    });
    if (onChangeText) onChangeText('');
  }

  _getValue = (props, state) => {
    const { value } = props;
    return value === undefined || value === null ?
      state.value : value;
  }

  render() {
    const { children } = this.props;
    const value = this._getValue(this.props, this.state);

    const result = this.state.results[value] || empty;

    return children({
      onChangeText: this._onChangeText,
      value,
      clearText: this._handleClearText,
      result,
    });
  }
}
