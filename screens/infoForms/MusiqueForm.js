import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, Button, StyleSheet } from 'react-native';
import LinkInput from './../../components/LinkInput';
import CustomImagePicker from './../../components/ImagePicker';

export default function MusiqueForm({ formData = {}, onChange, onNext, onBack }) {
  const [local, setLocal] = React.useState({
    title: formData.title || '',
    artist: formData.artist || '',
    album: formData.album || '',
    description: formData.description || '',
    link: formData.link || '',
    recommendedBy: formData.recommendedBy || '',
    image: formData.image || null,
  });
  const [showError, setShowError] = useState(false);

  // Validation du champ titre
  const isTitleValid = !!local.title && local.title.trim().length > 0;

  // À chaque modif, on prévient le parent
  const handleChange = (key, value) => {
    const updated = { ...local, [key]: value };
    setLocal(updated);
    onChange(updated);
    setShowError(false);
  };

  // Handler “suivant”
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
      <Text style={styles.label}>Titre de la musique *</Text>
      <TextInput
        placeholder="ex : See You Again"
        value={local.title}
        onChangeText={(t) => handleChange('title', t)}
        style={styles.input}
      />

      <Text style={styles.label}>Artiste</Text>
      <TextInput
        placeholder="ex : Tyler, The Creator"
        value={local.artist}
        onChangeText={(t) => handleChange('artist', t)}
        style={styles.input}
      />

      <Text style={styles.label}>Album</Text>
      <TextInput
        placeholder="ex : Flower Boy"
        value={local.album}
        onChangeText={(t) => handleChange('album', t)}
        style={styles.input}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        placeholder="ex : A beautiful song"
        value={local.description}
        onChangeText={(t) => handleChange('description', t)}
        style={styles.input}
      />

      <Text style={styles.label}>Recommandé par</Text>
      <TextInput
        placeholder="ex : Adrien"
        value={local.recommendedBy}
        onChangeText={(t) => handleChange('recommendedBy', t)}
        style={styles.input}
      />

      <CustomImagePicker
        value={local.image}
        onChange={(imageUri) => handleChange("image", imageUri)}
        placeholder="Ajouter une image pour la musique"
      />

      <LinkInput
        value={local.link}
        onChange={(text) => handleChange('link', text)}
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
  label: { marginTop: 16, fontWeight: 'bold', fontSize: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#FFF",
  },
  errorText: { color: "red", marginTop: 8 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
  },
});