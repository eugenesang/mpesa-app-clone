import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function MainScreen({ setIsLoggedIn }) {
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to the Main Screen!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: 'opinion-pro', // Apply custom font here
  },
});
