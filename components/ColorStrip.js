import React from "react";
import { View, StyleSheet, Platform } from "react-native";

const isIOS = Platform.OS === "ios";

export default function ColorStrip({ colors }) {
  return (
    <View style={styles.colorStripContainer}>
      {colors.map((c, i) => (
        <View key={i} style={[styles.colorBand, { backgroundColor: c }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  colorStripContainer: {
    position: "absolute",
    top: isIOS ? 60 : 0,
    right: 100,
    height: "100%",
    width: 80,
    flexDirection: "row",
    zIndex: 15,
  },
  colorBand: {
    flex: 1,
  },
});
