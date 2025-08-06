import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import LinkInput from './../../components/LinkInput';
import CustomImagePicker from './../../components/ImagePicker';
import { getPodcastInfoFromUrl, isValidPodcastUrl, searchPodcastByName } from './../../services/PodcastService';
import { getYouTubePodcastInfo, isValidYouTubePodcastUrl, isApiKeyConfigured as isYouTubeApiConfigured } from './../../services/YouTubePodcastService';
import { getPodcastInfoFromSpotifyUrl, getEpisodeInfoFromSpotifyUrl, isValidSpotifyPodcastUrl, isValidSpotifyEpisodeUrl, isApiKeyConfigured as isSpotifyApiConfigured } from './../../services/SpotifyPodcastService';

export default function PodcastForm({ formData = {}, onChange, onNext, onBack }) {
  const [local, setLocal] = React.useState({
    title: formData.title || '',
    hosts: formData.hosts || '',
    description: formData.description || '',
    link: formData.link || '',
    recommendedBy: formData.recommendedBy || '',
    image: formData.image || null,
  });
  const [isLoadingPodcastInfo, setIsLoadingPodcastInfo] = React.useState(false);

  const handleChange = (key, value) => {
    const updated = { ...local, [key]: value };
    setLocal(updated);
    onChange(updated);
  };

  const handleLinkChange = async (text) => {
    handleChange('link', text);
    
    // Récupérer automatiquement les infos podcast si l'URL est valide
    if (text) {
      setIsLoadingPodcastInfo(true);
      try {
        let podcastInfo = null;
        
        // Essayer de récupérer les infos via l'API iTunes/Spotify
        if (isValidPodcastUrl(text)) {
          podcastInfo = await getPodcastInfoFromUrl(text);
        }
        
        // Essayer Spotify Podcasts
        if (!podcastInfo && isValidSpotifyPodcastUrl(text)) {
          if (isSpotifyApiConfigured()) {
            podcastInfo = await getPodcastInfoFromSpotifyUrl(text);
          } else {
            console.log('⚠️ Clé API Spotify non configurée');
          }
        }

        // Essayer Spotify Episodes
        if (!podcastInfo && isValidSpotifyEpisodeUrl(text)) {
          if (isSpotifyApiConfigured()) {
            podcastInfo = await getEpisodeInfoFromSpotifyUrl(text);
          } else {
            console.log('⚠️ Clé API Spotify non configurée');
          }
        }
        
        // Essayer YouTube/YouTube Music
        if (!podcastInfo && isValidYouTubePodcastUrl(text)) {
          if (isYouTubeApiConfigured()) {
            podcastInfo = await getYouTubePodcastInfo(text);
          } else {
            console.log('⚠️ Clé API YouTube non configurée');
          }
        }
        
        // Si pas d'infos trouvées, essayer de rechercher par nom
        if (!podcastInfo) {
          podcastInfo = await searchPodcastByName(text);
        }
        
        if (podcastInfo) {
          const updated = {
            ...local,
            link: text,
            title: podcastInfo.title || local.title,
            hosts: podcastInfo.hosts || local.hosts,
            description: podcastInfo.description || local.description,
            image: podcastInfo.image || local.image,
          };
          setLocal(updated);
          onChange(updated);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des infos podcast:', error);
      } finally {
        setIsLoadingPodcastInfo(false);
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
      <Text style={styles.sectionTitle}>🔗 Lien du podcast</Text>
      <Text style={styles.sectionDescription}>
        Collez un lien iTunes, Spotify, YouTube ou YouTube Music pour récupérer automatiquement les informations
      </Text>
      
      <LinkInput
        value={local.link}
        onChange={handleLinkChange}
      />

      {isLoadingPodcastInfo && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#0000ff" />
          <Text style={styles.loadingText}>Récupération des informations...</Text>
        </View>
      )}

      {local.link && !isValidPodcastUrl(local.link) && !isValidSpotifyPodcastUrl(local.link) && !isValidSpotifyEpisodeUrl(local.link) && !isValidYouTubePodcastUrl(local.link) && (
        <Text style={styles.warningText}>
          ⚠️ L'URL ne semble pas être une URL de podcast valide
        </Text>
      )}

      {local.link && isValidPodcastUrl(local.link) && (
        <Text style={styles.infoText}>
          ✅ URL de podcast valide - Les métadonnées seront récupérées automatiquement
        </Text>
      )}

      {local.link && isValidSpotifyPodcastUrl(local.link) && (
        <Text style={styles.infoText}>
          ✅ URL Spotify Podcast valide - Les métadonnées seront récupérées automatiquement
        </Text>
      )}

      {local.link && isValidSpotifyEpisodeUrl(local.link) && (
        <Text style={styles.infoText}>
          ✅ URL Spotify Episode valide - Les métadonnées seront récupérées automatiquement
        </Text>
      )}

      {local.link && (isValidSpotifyPodcastUrl(local.link) || isValidSpotifyEpisodeUrl(local.link)) && !isSpotifyApiConfigured() && (
        <Text style={styles.warningText}>
          ⚠️ Clé API Spotify non configurée - Récupération manuelle des infos
        </Text>
      )}

      {local.link && isValidYouTubePodcastUrl(local.link) && (
        <Text style={styles.infoText}>
          ✅ URL YouTube Podcast valide - Les métadonnées seront récupérées automatiquement
        </Text>
      )}

      {local.link && isValidYouTubePodcastUrl(local.link) && !isYouTubeApiConfigured() && (
        <Text style={styles.warningText}>
          ⚠️ Clé API YouTube non configurée - Récupération manuelle des infos
        </Text>
      )}

      {/* Section Informations - Après le lien */}
      <Text style={styles.sectionTitle}>📝 Informations du podcast</Text>
      <Text style={styles.sectionDescription}>
        Ces champs seront automatiquement remplis si vous avez fourni un lien valide
      </Text>

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

      <CustomImagePicker
        value={local.image}
        onChange={(imageUri) => handleChange("image", imageUri)}
        placeholder="Ajouter une image pour le podcast"
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
  errorText: { color: 'red', marginTop: 8 },
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
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});