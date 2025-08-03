import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import LinkInput from "./../../components/LinkInput";
import CustomImagePicker from "./../../components/ImagePicker";

export default function FilmForm({ formData = {}, onChange, onNext, onBack }) {
  const [local, setLocal] = React.useState({
    title: formData.title || '',
    director: formData.director || '',
    description: formData.description || '',
    link: formData.link || '',
    recommendedBy: formData.recommendedBy || '',
    platform: formData.platform || '',
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

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.label}>Titre du film *</Text>
      <TextInput
        style={styles.input}
        value={local.title}
        onChangeText={(t) => handleChange("title", t)}
        placeholder="ex : Interstellar"
      />

      <Text style={styles.label}>Réalisateur</Text>
      <TextInput
        style={styles.input}
        value={local.director}
        onChangeText={(t) => handleChange("director", t)}
        placeholder="ex : Christopher Nolan"
      />

      <Text style={styles.label}>Plateforme</Text>
      <TextInput
        style={styles.input}
        value={local.platform}
        onChangeText={(t) => handleChange("platform", t)}
        placeholder="ex : Netflix, Prime Video, Disney+"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 60 }]}
        value={local.description}
        onChangeText={(t) => handleChange("description", t)}
        placeholder="ex : Un grand voyage SF..."
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
        placeholder="Ajouter une image pour le film"
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
    padding: 5,
    justifyContent: "flex-start",
  },
  label: {
    marginTop: 16,
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 8,
    marginTop: 6,
    backgroundColor: "#FFF",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
  },
  errorText: {
    color: "red",
    marginTop: 8,
  },
});
