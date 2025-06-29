import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';

// Si tu as déplacé contentData dans un fichier séparé (e.g. data/contentData.js), importe-le :
// import contentData from '../data/contentData';

const isIOS = Platform.OS === 'ios';

export default function ColorStrip({ index, data }) {
  // `data` doit être le tableau `contentData` passé depuis App.js
  const colors = data[index].stripColors;

  return (
    <View style={styles.stripContainer}>
      {colors.map((color, i) => (
        <View
          key={i}
          style={[styles.colorBand, { backgroundColor: color }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stripContainer: {
    position: 'absolute',
    top: isIOS ? 60 : 0,
    right: 100,
    width: 80,
    height: '100%',
    flexDirection: 'row',
    zIndex: 15,
    transform: [{ rotate: '45deg' }],
  },
  colorBand: {
    flex: 1,
  },
});