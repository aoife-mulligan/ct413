import 'react-native-gesture-handler';
import { AuthProvider } from './src/components/hooks/AuthContext';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import Navigation from './src/navigation';

function App(): React.JSX.Element {
  // No need for useState or useEffect hooks here anymore, AuthProvider will take care of it

  return (
    <NavigationContainer>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#262626',
  },
});

export default App;
