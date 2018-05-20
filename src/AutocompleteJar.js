import React, { PureComponent } from 'react';

type Props = {
  children: ({
    onChangeText: (text) => void,
    value: string,
    clearText: () => void,
    data: [any],
  }) => React.Component,
};

const empty = { status: 'EMPTY' };

export default class AutocompleteJar extends PureComponent<Props> {
  state = {
    results: {},
    value: '',
  }

  componentWillUnmount() {
    this._isUnmounted = true;
  }

  _isUnmounted = false

  _onChangeText = (text) => {
    this.setState({
      value: text,
    });
    const resultData = this.state.results[text];
    if (text && (!resultData || typeof resultData === 'string')) {
      this.setState({
        results: {
          ...this.state.results,
          [text]: { status: 'LOADING' },
        },
      });

      const { fetchResults } = this.props;
      fetchResults(text)
        .then((data) => {
          if (this._isUnmounted) return;

          this.setState({
            results: {
              ...this.state.results,
              [text]: { status: 'SUCCESS', data },
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
              [text]: { status: 'ERROR', error },
            },
          });
        });
    }
  }

  _handleClearText = () => {
    this.setState({
      value: '',
    });
  }

  render() {
    const { children } = this.props;
    const { value } = this.state;

    const result = this.state.results[value] || empty;

    return children({
      onChangeText: this._onChangeText,
      value,
      clearText: this._handleClearText,
      result,
    });
  }
}
