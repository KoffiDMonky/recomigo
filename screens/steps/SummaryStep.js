import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button } from 'react-native';

export default function SummaryStep({ formData, onNext, onBack }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.summaryItem}>
        <Text style={styles.label}>Catégorie :</Text>
        <Text style={styles.value}>{formData.type}</Text>
      </View>

      <View style={styles.summaryItem}>
        <Text style={styles.label}>Titre :</Text>
        <Text style={styles.value}>{formData.title || '—'}</Text>
      </View>

      {formData.artist && (
        <View style={styles.summaryItem}>
          <Text style={styles.label}>Artiste :</Text>
          <Text style={styles.value}>{formData.artist}</Text>
        </View>
      )}

      {formData.director && (
        <View style={styles.summaryItem}>
          <Text style={styles.label}>Réalisateur :</Text>
          <Text style={styles.value}>{formData.director}</Text>
        </View>
      )}

      {formData.hosts && (
        <View style={styles.summaryItem}>
          <Text style={styles.label}>Animateurs :</Text>
          <Text style={styles.value}>{formData.hosts}</Text>
        </View>
      )}

      {formData.platform && (
        <View style={styles.summaryItem}>
          <Text style={styles.label}>Plateforme :</Text>
          <Text style={styles.value}>{formData.platform}</Text>
        </View>
      )}

      {formData.link && (
        <View style={styles.summaryItem}>
          <Text style={styles.label}>Lien :</Text>
          <Text style={styles.value}>{formData.link}</Text>
        </View>
      )}

      {formData.recommendedBy && (
        <View style={styles.summaryItem}>
          <Text style={styles.label}>Recommandé par :</Text>
          <Text style={styles.value}>{formData.recommendedBy}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  summaryItem: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#555',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
});