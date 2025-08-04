import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Bienvenue sur Recomigo 👋',
    subtitle: 'L\'app pour noter, garder et partager tes recommandations culturelles',
    description: 'Films, séries, musiques, podcasts, vidéos YouTube : tout ce que tu aimes, à portée de swipe.',
    icon: 'heart-outline',
    color: '#FBFF29',
  },
  {
    id: 2,
    title: 'Swipe pour découvrir 🎬',
    subtitle: 'Navigue entre tes recommandations',
    description: 'Swipe vers le haut ou le bas pour passer d\'une carte à l\'autre. Chaque carte contient toutes les infos importantes.',
    icon: 'swap-vertical-outline',
    color: '#E74C3C',
  },
  {
    id: 3,
    title: 'Ajoute tes coups de cœur ⭐',
    subtitle: 'Partage tes découvertes',
    description: 'Appuie sur le bouton + pour ajouter tes propres recommandations. Choisis la catégorie et remplis les infos.',
    icon: 'add-circle-outline',
    color: '#3498DB',
  },
  {
    id: 4,
    title: 'Filtre par catégorie 🎯',
    subtitle: 'Trouve ce qui t\'intéresse',
    description: 'Utilise les filtres pour voir seulement les films, séries, musiques ou podcasts. Appuie sur l\'icône paramètres.',
    icon: 'filter-outline',
    color: '#9B59B6',
  },
  {
    id: 5,
    title: 'Partage tes découvertes 📤',
    subtitle: 'Fais découvrir aux autres',
    description: 'Appuie sur "Partager" pour envoyer tes recommandations à tes amis. Ils pourront découvrir tes coups de cœur.',
    icon: 'share-social-outline',
    color: '#2ECC71',
  },
  {
    id: 6,
    title: 'C\'est parti ! 🚀',
    subtitle: 'Tu es prêt à découvrir',
    description: 'Tu peux maintenant explorer l\'app. N\'hésite pas à ajouter tes propres recommandations et à les partager.',
    icon: 'rocket-outline',
    color: '#F39C12',
  },
];

export default function OnboardingScreen({ navigation, route }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('onboarding_completed', 'true');
      // La navigation se fera automatiquement via App.js qui surveille AsyncStorage
    } catch (error) {
      console.error('Erreur sauvegarde onboarding:', error);
    }
  };

  // Supprimer le useEffect qui surveille AsyncStorage

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    setCurrentIndex(index);
  };

  const currentSlide = slides[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FBFF29" />
      
      {/* Header avec Skip */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {slides.map((slide, index) => (
          <View key={slide.id} style={styles.slide}>
            <View style={[styles.iconContainer, { backgroundColor: slide.color }]}>
              <Ionicons name={slide.icon} size={80} color="#FFF" />
            </View>
            
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.subtitle}>{slide.subtitle}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        <View style={styles.progressContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentIndex && styles.progressDotActive,
              ]}
            />
          ))}
        </View>
        
        <View style={styles.navButtons}>
          <TouchableOpacity
            style={[styles.navButton, styles.skipNavButton]}
            onPress={handleSkip}
          >
            <Text style={styles.skipNavText}>Passer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex === slides.length - 1 ? 'Commencer' : 'Suivant'}
            </Text>
            <Ionicons
              name={currentIndex === slides.length - 1 ? 'checkmark' : 'arrow-forward'}
              size={20}
              color="#FFF"
              style={styles.nextIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFF29',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerSpacer: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DDD',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#000',
    width: 24,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    height: height - 200,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    color: '#888',
  },
  navigation: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  skipNavButton: {
    backgroundColor: 'transparent',
  },
  skipNavText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#000',
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextIcon: {
    marginLeft: 8,
  },
}); 