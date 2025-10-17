import React from 'react';
import {View, StyleSheet, StatusBar, Platform} from 'react-native';

const WebviewScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
        translucent={false}
      />
      <View style={styles.webviewContainer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default WebviewScreen;
