import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function CustomImagePicker({ value, onChange, placeholder = "Ajouter une image" }) {
  const [image, setImage] = useState(value);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder à votre galerie.');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    console.log('🔍 pickImage appelé');
    const hasPermission = await requestPermissions();
    console.log('🔍 Permission galerie:', hasPermission);
    if (!hasPermission) return;

    console.log('🔍 Lancement de la galerie...');
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      console.log('🔍 Résultat galerie:', result);
      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedImage = result.assets[0];
        console.log('🔍 Image sélectionnée:', selectedImage.uri);
        setImage(selectedImage.uri);
        onChange(selectedImage.uri);
      }
    } catch (error) {
      console.error('🔍 Erreur galerie:', error);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder à votre caméra.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const selectedImage = result.assets[0];
      setImage(selectedImage.uri);
      onChange(selectedImage.uri);
    }
  };

  const showImageOptions = () => {
    console.log('🔍 showImageOptions appelé');
    Alert.alert(
      'Sélectionner une image',
      'Choisissez une option',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Prendre une photo', onPress: takePhoto },
        { text: 'Choisir depuis la galerie', onPress: pickImage },
      ]
    );
  };

  const removeImage = () => {
    setImage(null);
    onChange(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Image</Text>
      
      {image ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
            <Ionicons name="close-circle" size={24} color="#F44336" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.placeholder} onPress={pickImage}>
          <Ionicons name="camera-outline" size={32} color="#666" />
          <Text style={styles.placeholderText}>{placeholder}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  placeholder: {
    borderWidth: 2,
    borderColor: '#DDD',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
  },
  placeholderText: {
    color: '#666',
    marginTop: 8,
    fontSize: 14,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 12,
  },
}); 