import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import MovieSearchInput from "./../../components/MovieSearchInput";
import CustomImagePicker from "./../../components/ImagePicker";

export default function SerieForm({ formData = {}, onChange, onNext, onBack }) {
  const [local, setLocal] = React.useState({
    title: formData.title || '',
    director: formData.director || '',
    description: formData.description || '',
    link: formData.link || '',
    recommendedBy: formData.recommendedBy || '',
    platform: formData.platform || '',
    image: formData.image || null,
  });

  const handleChange = (key, value) => {
    const updated = { ...local, [key]: value };
    setLocal(updated);
    onChange(updated);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Section Lien - En premier */}
      <MovieSearchInput
        type="tv"
        onMovieFound={(movieData) => {
          // Mettre à jour tous les champs avec les données trouvées
          const updated = {
            ...local,
            title: movieData.title,
            description: movieData.description,
            year: movieData.year,
            genre: movieData.genre,
            rating: movieData.rating,
            director: movieData.director,
            cast: movieData.cast,
            image: movieData.image,
            link: `https://www.themoviedb.org/${movieData.mediaType}/${movieData.tmdbId}`,
          };
          setLocal(updated);
          onChange(updated);
        }}
      />

      {/* Section Informations - Après le lien */}
      <Text style={styles.sectionTitle}>📝 Informations de la série</Text>
      <Text style={styles.sectionDescription}>
        Remplissez les informations de la série
      </Text>

      <Text style={styles.label}>Titre de la série *</Text>
      <TextInput
        style={styles.input}
        value={local.title}
        onChangeText={(t) => handleChange("title", t)}
        placeholder="ex : Breaking Bad"
      />

      <Text style={styles.label}>Réalisateur</Text>
      <TextInput
        style={styles.input}
        value={local.director}
        onChangeText={(t) => handleChange("director", t)}
        placeholder="ex : Vince Gilligan"
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
        placeholder="ex : Un professeur de chimie..."
        multiline
      />

      <Text style={styles.label}>Recommandé par</Text>
      <TextInput
        style={styles.input}
        value={local.recommendedBy}
        onChangeText={(t) => handleChange("recommendedBy", t)}
        placeholder="ex : Adrien"
      />

      <CustomImagePicker
        value={local.image}
        onChange={(imageUri) => handleChange("image", imageUri)}
        placeholder="Ajouter une image pour la série"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "flex-start",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
    color: '#333',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  label: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginTop: 12,
    color: '#333',
  },
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