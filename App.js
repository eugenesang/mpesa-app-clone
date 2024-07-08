import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import AuthScreen from './Screens/AuthScreen';
import MainScreen from './Screens/MainScreen';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [isLogedIn, setIsLoggedIn] = useState(false);

  let [fontsLoaded] = useFonts({
    'opinion-pro': require('./assets/fonts/opinion-pro-condensed-light.otf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" backgroundColor='#000' />
      {!isLogedIn && <AuthScreen setIsLoggedIn={setIsLoggedIn} />}
      {isLogedIn && <MainScreen setIsLoggedIn={setIsLoggedIn} />}
    </NavigationContainer>
  );
}
