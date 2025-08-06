import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MovieService from '../services/MovieService.js';

export default function MovieSearchInput({ onMovieFound, type = 'movie' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Recherche automatique avec délai
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchTerm.trim().length >= 3) {
        await searchSuggestions();
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500); // Délai de 500ms

    return () => clearTimeout(searchTimeout);
  }, [searchTerm]);

  const searchSuggestions = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    
    try {
      const results = await MovieService.searchMovieSuggestions(searchTerm.trim(), type);
      setSuggestions(results || []);
      setShowSuggestions(results && results.length > 0);
    } catch (error) {
      console.error('Erreur lors de la recherche de suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = async (suggestion) => {
    setSearchTerm(suggestion.title);
    setShowSuggestions(false);
    setSuggestions([]);
    
    try {
      // Utiliser l'ID TMDB spécifique pour récupérer les bonnes informations
      const movieData = await MovieService.getMovieById(suggestion.id, suggestion.mediaType);
      
      if (movieData) {
        onMovieFound(movieData);
        setSearchTerm('');
      } else {
        Alert.alert(
          'Aucun résultat',
          `Aucun ${type === 'movie' ? 'film' : 'série'} trouvé pour "${suggestion.title}"`
        );
      }
    } catch (error) {
      console.error('Erreur lors de la sélection:', error);
      Alert.alert('Erreur', 'Impossible de récupérer les détails du film/série');
    }
  };

  const handleManualSearch = async () => {
    if (!searchTerm.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un titre de film ou série');
      return;
    }

    setIsLoading(true);
    
    try {
      const movieData = await MovieService.searchMovieByTitle(searchTerm.trim(), type);
      
      if (movieData) {
        onMovieFound(movieData);
        setSearchTerm('');
        setShowSuggestions(false);
        setSuggestions([]);
      } else {
        Alert.alert(
          'Aucun résultat',
          `Aucun ${type === 'movie' ? 'film' : 'série'} trouvé pour "${searchTerm}"`
        );
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      Alert.alert('Erreur', 'Impossible de rechercher le film/série');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        🔍 Rechercher un {type === 'movie' ? 'film' : 'série'}
      </Text>
      
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={`Entrez le titre du ${type === 'movie' ? 'film' : 'série'}...`}
            value={searchTerm}
            onChangeText={setSearchTerm}
            autoCapitalize="words"
            autoCorrect={false}
            onSubmitEditing={handleManualSearch}
            returnKeyType="search"
          />
          <TouchableOpacity
            style={[styles.searchButton, isLoading && styles.searchButtonDisabled]}
            onPress={handleManualSearch}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons name="search" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
        
        {/* Dropdown des suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <View style={styles.dropdownContainer}>
            {suggestions.map((item, index) => (
              <TouchableOpacity
                key={`${item.id}-${index}`}
                style={styles.suggestionItem}
                onPress={() => handleSelectSuggestion(item)}
              >
                <View style={styles.suggestionContent}>
                  <Text style={styles.suggestionTitle}>{item.title}</Text>
                  <View style={styles.suggestionDetails}>
                    <Text style={styles.suggestionYear}>
                      {item.year} • {item.type}
                    </Text>
                    {item.director && (
                      <Text style={styles.suggestionDirector}>
                        Réalisé par {item.director}
                      </Text>
                    )}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      
      <Text style={styles.hint}>
        💡 Exemples : "Jeux d'enfants", "The Matrix", "Breaking Bad"
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 9999,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  searchContainer: {
    marginBottom: 8,
    position: 'relative',
    zIndex: 9999,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 48,
  },
  searchButtonDisabled: {
    backgroundColor: '#ccc',
  },
  dropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 9999,
  },

  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  suggestionDetails: {
    flexDirection: 'column',
  },
  suggestionYear: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  suggestionDirector: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
}); 