import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import LinkInput from './../../components/LinkInput';
import CustomImagePicker from './../../components/ImagePicker';
import { getSpotifyInfoFromUrl, isValidSpotifyUrl, isApiKeyConfigured as isSpotifyApiConfigured } from './../../services/SpotifyService';
import { getMusicInfoFromUrl, isValidYouTubeMusicUrl, isApiKeyConfigured as isYouTubeApiConfigured } from './../../services/YouTubeMusicService';

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
  const [isLoadingMusicInfo, setIsLoadingMusicInfo] = React.useState(false);

  // À chaque modif, on prévient le parent
  const handleChange = (key, value) => {
    const updated = { ...local, [key]: value };
    setLocal(updated);
    onChange(updated);
  };

  const handleLinkChange = async (text) => {
    handleChange('link', text);
    
    // Récupérer automatiquement les infos si l'URL est valide
    if (text) {
      setIsLoadingMusicInfo(true);
      try {
        let musicInfo = null;
        
        // Essayer Spotify en premier
        if (isValidSpotifyUrl(text)) {
          if (isSpotifyApiConfigured()) {
            musicInfo = await getSpotifyInfoFromUrl(text);
          } else {
            console.log('⚠️ Clé API Spotify non configurée');
          }
        }
        // Essayer YouTube Music ensuite
        else if (isValidYouTubeMusicUrl(text)) {
          if (isYouTubeApiConfigured()) {
            musicInfo = await getMusicInfoFromUrl(text);
          } else {
            console.log('⚠️ Clé API YouTube non configurée');
          }
        }
        
        if (musicInfo) {
          const updated = {
            ...local,
            link: text,
            title: musicInfo.title || local.title,
            artist: musicInfo.artist || local.artist,
            album: musicInfo.album || local.album,
            duration: musicInfo.duration || local.duration,
            image: musicInfo.image || local.image,
            description: musicInfo.description || local.description,
          };
          setLocal(updated);
          onChange(updated);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des infos musicales:', error);
      } finally {
        setIsLoadingMusicInfo(false);
      }
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Section Lien - En premier */}
      <Text style={styles.sectionTitle}>🔗 Lien de la musique</Text>
      <Text style={styles.sectionDescription}>
        Collez un lien Spotify ou YouTube Music pour récupérer automatiquement les informations
      </Text>
      
      <LinkInput
        value={local.link}
        onChange={handleLinkChange}
      />

      {isLoadingMusicInfo && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#0000ff" />
          <Text style={styles.loadingText}>Récupération des informations...</Text>
        </View>
      )}

      {local.link && !isValidSpotifyUrl(local.link) && !isValidYouTubeMusicUrl(local.link) && (
        <Text style={styles.warningText}>
          ⚠️ L'URL ne semble pas être une URL Spotify ou YouTube Music valide
        </Text>
      )}

      {local.link && isValidSpotifyUrl(local.link) && (
        <Text style={styles.infoText}>
          ✅ URL Spotify valide - Les métadonnées seront récupérées automatiquement
        </Text>
      )}

      {local.link && isValidYouTubeMusicUrl(local.link) && (
        <Text style={styles.infoText}>
          ✅ URL YouTube Music valide - Les métadonnées seront récupérées automatiquement
        </Text>
      )}

      {local.link && isValidSpotifyUrl(local.link) && !isSpotifyApiConfigured() && (
        <Text style={styles.warningText}>
          ⚠️ Clé API Spotify non configurée - Récupération manuelle des infos
        </Text>
      )}

      {local.link && isValidYouTubeMusicUrl(local.link) && !isYouTubeApiConfigured() && (
        <Text style={styles.warningText}>
          ⚠️ Clé API YouTube non configurée - Récupération manuelle des infos
        </Text>
      )}

      {/* Section Informations - Après le lien */}
      <Text style={styles.sectionTitle}>📝 Informations de la musique</Text>
      <Text style={styles.sectionDescription}>
        Ces champs seront automatiquement remplis si vous avez fourni un lien valide
      </Text>

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

      {isLoadingMusicInfo && (
        <ActivityIndicator size="small" color="#0000ff" style={{ marginTop: 10 }} />
      )}

      {local.link && !isValidSpotifyUrl(local.link) && !isValidYouTubeMusicUrl(local.link) && (
        <Text style={styles.warningText}>
          ⚠️ L'URL ne semble pas être une URL Spotify ou YouTube Music valide
        </Text>
      )}

      {local.link && isValidSpotifyUrl(local.link) && (
        <Text style={styles.infoText}>
          ✅ URL Spotify valide - Les métadonnées seront récupérées automatiquement
        </Text>
      )}

      {local.link && isValidYouTubeMusicUrl(local.link) && (
        <Text style={styles.infoText}>
          ✅ URL YouTube Music valide - Les métadonnées seront récupérées automatiquement
        </Text>
      )}

      {local.link && isValidSpotifyUrl(local.link) && !isSpotifyApiConfigured() && (
        <Text style={styles.warningText}>
          ⚠️ Clé API Spotify non configurée - Récupération manuelle des infos
        </Text>
      )}

      {local.link && isValidYouTubeMusicUrl(local.link) && !isYouTubeApiConfigured() && (
        <Text style={styles.warningText}>
          ⚠️ Clé API YouTube non configurée - Récupération manuelle des infos
        </Text>
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
    marginTop: 16, 
    fontWeight: 'bold', 
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#FFF",
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  loadingText: {
    marginLeft: 8,
    color: '#0066cc',
    fontSize: 14,
  },
  errorText: { color: "red", marginTop: 8 },
  warningText: {
    color: 'orange',
    marginTop: 8,
    fontSize: 14,
  },
  infoText: {
    color: '#666',
    marginTop: 8,
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
  },
});