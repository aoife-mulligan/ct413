/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import Header from './src/components/Header';
import SignInScreen from './src/screens/SignInScreen';

import {
  SafeAreaView,
  StyleSheet,
  Text
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.root}>
      <SignInScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#262626',
  },
});

export default App;
