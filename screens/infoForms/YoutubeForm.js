import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import LinkInput from "./../../components/LinkInput";
import CustomImagePicker from "./../../components/ImagePicker";
import { isValidYouTubeUrl } from "./../../utils/youtubeUtils";
import { getVideoInfoFromUrl, isApiKeyConfigured } from "./../../services/YouTubeService";

export default function YoutubeForm({ formData = {}, onChange, onNext, onBack }) {
  const [local, setLocal] = React.useState({
    title: formData.title || '',
    link: formData.link || '',
    recommendedBy: formData.recommendedBy || '',
    image: formData.image || null,
  });
  const [showError, setShowError] = React.useState(false);
  const [isLoadingVideoInfo, setIsLoadingVideoInfo] = React.useState(false);

  const isTitleValid = !!local.title && local.title.trim().length > 0;

  const handleChange = (key, value) => {
    const updated = { ...local, [key]: value };
    setLocal(updated);
    onChange(updated);
    setShowError(false);
  };

  const handleLinkChange = async (text) => {
    handleChange('link', text);
    
    // Récupérer automatiquement les infos YouTube si l'URL est valide
    if (text && isValidYouTubeUrl(text) && isApiKeyConfigured()) {
      setIsLoadingVideoInfo(true);
      try {
        const videoInfo = await getVideoInfoFromUrl(text);
        if (videoInfo) {
          const updated = {
            ...local,
            link: text,
            title: videoInfo.title || local.title,
            channelTitle: videoInfo.channelTitle,
            duration: videoInfo.duration,
          };
          setLocal(updated);
          onChange(updated);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des infos YouTube:', error);
      } finally {
        setIsLoadingVideoInfo(false);
      }
    }
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
      <Text style={styles.label}>Titre de la vidéo *</Text>
      <TextInput
        placeholder="ex : Pourquoi l'algorithme YouTube t'adore"
        value={local.title}
        onChangeText={(t) => handleChange('title', t)}
        style={styles.input}
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
        onChange={handleLinkChange}
      />

      {isLoadingVideoInfo && (
        <ActivityIndicator size="small" color="#0000ff" style={{ marginTop: 10 }} />
      )}

      {local.link && !isValidYouTubeUrl(local.link) && (
        <Text style={styles.warningText}>
          ⚠️ L'URL ne semble pas être une URL YouTube valide
        </Text>
      )}

      {local.link && isValidYouTubeUrl(local.link) && (
        <Text style={styles.infoText}>
          ✅ URL YouTube valide - La miniature sera récupérée automatiquement
        </Text>
      )}

      {local.link && isValidYouTubeUrl(local.link) && isApiKeyConfigured() && (
        <Text style={styles.infoText}>
          🔄 Récupération automatique du titre et de la description...
        </Text>
      )}

      {local.link && isValidYouTubeUrl(local.link) && !isApiKeyConfigured() && (
        <Text style={styles.warningText}>
          ⚠️ Clé API YouTube non configurée - Récupération manuelle des infos
        </Text>
      )}

      <Text style={styles.infoText}>
        💡 Si vous ne choisissez pas d'image, la miniature YouTube sera récupérée automatiquement
      </Text>

      <CustomImagePicker
        value={local.image}
        onChange={(imageUri) => handleChange("image", imageUri)}
        placeholder="Ajouter une image personnalisée (optionnel)"
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