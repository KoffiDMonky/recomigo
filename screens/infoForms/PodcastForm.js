import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, Button, StyleSheet } from 'react-native';
import LinkInput from './../../components/LinkInput';
import CustomImagePicker from './../../components/ImagePicker';

export default function PodcastForm({ formData = {}, onChange, onNext, onBack }) {
  const [local, setLocal] = React.useState({
    title: formData.title || '',
    hosts: formData.hosts || '',
    description: formData.description || '',
    link: formData.link || '',
    recommendedBy: formData.recommendedBy || '',
    image: formData.image || null,
  });
  const [showError, setShowError] = React.useState(false);

  const isTitleValid = !!local.title && local.title.trim().length > 0;

  const handleChange = (key, value) => {
    const updated = { ...local, [key]: value };
    setLocal(updated);
    onChange(updated);
    setShowError(false);
  };

  const handleSubmit = () => {
    if (isTitleValid) {
      onNext({ ...formData, ...local });
    } else {
      setShowError(true);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.label}>Titre du podcast *</Text>
      <TextInput
        placeholder="ex : Le Floodcast"
        value={local.title}
        onChangeText={(t) => handleChange('title', t)}
        style={styles.input}
      />

      <Text style={styles.label}>Animateurs</Text>
      <TextInput
        placeholder="ex : FloBer, Adrien Ménielle"
        value={local.hosts}
        onChangeText={(t) => handleChange('hosts', t)}
        style={styles.input}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 60 }]}
        value={local.description}
        onChangeText={(t) => handleChange("description", t)}
        placeholder="ex : Un podcast passionnant..."
        multiline
      />

      <Text style={styles.label}>Recommandé par</Text>
      <TextInput
        style={styles.input}
        value={local.recommendedBy}
        onChangeText={(t) => handleChange("recommendedBy", t)}
        placeholder="ex : Adrien"
      />

      <LinkInput
        value={local.link}
        onChange={(text) => handleChange("link", text)}
      />

      <CustomImagePicker
        value={local.image}
        onChange={(imageUri) => handleChange("image", imageUri)}
        placeholder="Ajouter une image pour le podcast"
      />

      {showError && !isTitleValid && (
        <Text style={styles.errorText}>Le titre est obligatoire.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "flex-start",
  },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FFF',
    marginBottom: 8,
  },
  errorText: { color: 'red', marginTop: 8 },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});