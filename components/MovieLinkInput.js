import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MovieService from '../services/MovieService';

export default function MovieLinkInput({ value, onChange, onImport, type = 'Film' }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [importedData, setImportedData] = useState(null);

  // Détecter si l'URL est valide pour un film/série
  useEffect(() => {
    if (value) {
      const isValid = MovieService.isValidMovieUrl(value);
      setIsValidUrl(isValid);
      
      // Réinitialiser les données importées si l'URL change
      if (importedData) {
        setImportedData(null);
      }
    } else {
      setIsValidUrl(false);
      setImportedData(null);
    }
  }, [value]);

  const handleImport = async () => {
    if (!value || !isValidUrl) {
      Alert.alert('Erreur', 'Veuillez entrer une URL valide de film ou série');
      return;
    }

    setIsLoading(true);
    
    try {
      const movieData = await MovieService.getMovieInfoFromUrl(value);
      
      if (movieData) {
        setImportedData(movieData);
        
        // Pré-remplir les champs avec les données importées
        const updatedData = {
          title: movieData.title || '',
          director: movieData.director || '',
          description: movieData.description || '',
          link: value,
          platform: movieData.platform || '',
          image: movieData.image || null,
          year: movieData.year || null,
          rating: movieData.rating || null,
          genre: movieData.genre || ''
        };
        
        onChange(updatedData);
        
        Alert.alert(
          'Import réussi !',
          `Les informations de "${movieData.title}" ont été importées.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Import impossible',
          'Impossible de récupérer les informations pour cette URL. Vérifiez que l\'URL est correcte.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de l\'import. Vérifiez votre connexion internet.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getPlatformIcon = () => {
    if (!value) return 'link-outline';
    
    if (value.includes('netflix')) return 'play-circle-outline';
    if (value.includes('primevideo') || value.includes('amazon')) return 'logo-amazon';
    if (value.includes('disneyplus') || value.includes('disney')) return 'play-circle-outline';
    if (value.includes('themoviedb') || value.includes('tmdb')) return 'film-outline';
    if (value.includes('allocine')) return 'film-outline';
    if (value.includes('imdb')) return 'star-outline';
    
    return 'link-outline';
  };

  const getPlatformName = () => {
    if (!value) return '';
    
    if (value.includes('netflix')) return 'Netflix';
    if (value.includes('primevideo') || value.includes('amazon')) return 'Prime Video';
    if (value.includes('disneyplus') || value.includes('disney')) return 'Disney+';
    if (value.includes('themoviedb') || value.includes('tmdb')) return 'TMDB';
    if (value.includes('allocine')) return 'AlloCiné';
    if (value.includes('imdb')) return 'IMDb';
    
    return 'Plateforme';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>🔗 Lien du {type.toLowerCase()}</Text>
      <Text style={styles.description}>
        Ajoutez un lien vers le {type.toLowerCase()} (Netflix, Prime Video, etc.)
      </Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={(text) => onChange({ link: text })}
          placeholder="https://exemple.com"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          style={[styles.input, isValidUrl && styles.validInput]}
        />
        
        {isValidUrl && (
          <TouchableOpacity
            style={[styles.importButton, isLoading && styles.importButtonDisabled]}
            onPress={handleImport}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Ionicons name="download-outline" size={20} color="#FFF" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Indicateur de plateforme */}
      {isValidUrl && (
        <View style={styles.platformIndicator}>
          <Ionicons name={getPlatformIcon()} size={16} color="#666" />
          <Text style={styles.platformText}>{getPlatformName()}</Text>
        </View>
      )}

      {/* Données importées */}
      {importedData && (
        <View style={styles.importedData}>
          <Text style={styles.importedTitle}>✅ Données importées :</Text>
          <Text style={styles.importedText}>Titre : {importedData.title}</Text>
          {importedData.director && (
            <Text style={styles.importedText}>Réalisateur : {importedData.director}</Text>
          )}
          {importedData.platform && (
            <Text style={styles.importedText}>Plateforme : {importedData.platform}</Text>
          )}
        </View>
      )}

      {/* Instructions */}
      <Text style={styles.instructions}>
        💡 Plateformes supportées : Netflix, Prime Video, Disney+, TMDB, AlloCiné, IMDb
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    marginTop: 16,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  validInput: {
    borderColor: '#4CAF50',
    backgroundColor: '#F8FFF8',
  },
  importButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 12,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  importButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  platformIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  platformText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  importedData: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  importedTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#2E7D32',
    marginBottom: 4,
  },
  importedText: {
    fontSize: 13,
    color: '#388E3C',
    marginBottom: 2,
  },
  instructions: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
}); 