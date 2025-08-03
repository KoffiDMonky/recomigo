// components/steps/LinkInput.js
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function LinkInput({ value, onChange }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Lien (facultatif)</Text>
      <TextInput
        value={value}
        onChangeText={(text) => onChange(text)}
        placeholder="https://exemple.com"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
  },
});