
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Weather from './src'; 

export default function Index() {
  return (
    <View style={styles.container}>
      <Weather />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
});
