import React from 'react';
import {View, StyleSheet, StatusBar, Platform} from 'react-native';
import WebViewComponent from '../components/webview/index';
import {getCurrentWebViewUrl} from '../components/webview/webview.config';

const WebviewScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
        translucent={false}
      />
      <View style={styles.webviewContainer}>
        <WebViewComponent initialUrl={getCurrentWebViewUrl()} />
      </View>
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
