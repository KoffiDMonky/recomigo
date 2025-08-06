import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  PanResponder,
  Animated,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";

import ColorStrip from "./../components/ColorStrip";
import CategoryPill from "./../components/CategoryPill";
import ContentCard from "./../components/ContentCard";

import AddCardModal from "./../screens/AddCardModal";
import MultiStepForm from "./../screens/MultiStepForm";
import DragHandle from "./../components/DragHandle";
import ShareService from "./../services/ShareService";
import HapticService from "./../services/HapticService";

import contentData from "./../data/ContentData";

import { enrichCard } from "./../data/storage";

import {
  getAllCards,
  addCard,
  saveCards,
  updateCard,
  deleteCard,
  clearAll,
} from "./../data/storage";

import AsyncStorage from "@react-native-async-storage/async-storage";

const isIOS = Platform.OS === "ios";
const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(height);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [isSettingsModalVisible, setSettingsModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    Film: true,
    "Série": true,
    Musique: true,
    Podcast: true,
    Youtube: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isHeightCalculated, setIsHeightCalculated] = useState(false);
  const scrollViewRef = useRef(null);
  const titleInputRef = useRef(null);
  const descInputRef = useRef(null);
  const modalTranslateY = useRef(new Animated.ValueXY()).current;

  async function loadCards({ allowInit = true } = {}) {
    if (!isLoading) {
      setIsLoading(true);
    }
    setIsHeightCalculated(false);
    try {
      const stored = await getAllCards(contentData, allowInit);
      setCards(stored);
    } catch (error) {
      console.error('Erreur lors du chargement des cartes:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleImageLoad = () => {
    setIsHeightCalculated(true);
  };

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.y;
    const index = Math.floor(contentOffset / scrollHeight);
    if (index !== currentIndex && index >= 0 && index < getFilteredCards().length) {
      HapticService.light();
      setCurrentIndex(index);
    }
  };

  const handleLayout = (e) => {
    const { height } = e.nativeEvent.layout;
    setScrollHeight(height);
    setIsHeightCalculated(true);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleLoadExamples = async () => {
    try {
      await clearAll();
      await loadCards({ allowInit: true });
      setModalVisible(false);
    } catch (error) {
      console.error('Erreur lors du chargement des exemples:', error);
    }
  };

  const handleCardLongPress = (card) => {
    HapticService.medium();
    setSelectedCard(card);
    setEditFormData(card);
    setEditModalVisible(true);
  };

  const handleDeleteCard = async () => {
    if (selectedCard) {
      try {
        await deleteCard(selectedCard.id);
        await loadCards();
        setEditModalVisible(false);
        setSelectedCard(null);
        setEditFormData(null);
        HapticService.success();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        Alert.alert('Erreur', 'Impossible de supprimer la carte');
      }
    }
  };

  const handleShare = () => {
    const currentCard = getFilteredCards()[currentIndex];
    if (currentCard) {
      ShareService.shareCard(currentCard);
    }
  };

  const toggleSettingsModal = () => {
    setSettingsModalVisible(!isSettingsModalVisible);
  };

  const handleFilterToggle = (category) => {
    HapticService.light();
    setActiveFilters(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getFilteredCards = () => {
    const filtered = cards.filter(card => activeFilters[card.type]);
    return filtered;
  };

  const resetFilters = () => {
    setActiveFilters({
      Film: true,
      "Série": true,
      Musique: true,
      Podcast: true,
      Youtube: true,
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      Film: "#E74C3C",
      "Série": "#3498DB",
      Musique: "#9B59B6",
      Podcast: "#2ECC71",
      Youtube: "#F39C12",
    };
    return colors[category] || "#000";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Film: "film-outline",
      "Série": "tv-outline",
      Musique: "musical-notes-outline",
      Podcast: "radio-outline",
      Youtube: "logo-youtube",
    };
    return icons[category] || "help-outline";
  };

  // Load cards from storage on mount
  useEffect(() => {
    const initializeApp = async () => {
      // Délai minimal pour s'assurer que l'état initial est bien défini
      await new Promise(resolve => setTimeout(resolve, 50));
      await loadCards();
      // Délai pour forcer le calcul de la hauteur si handleLayout n'est pas appelé
      setTimeout(() => {
        // setIsHeightCalculated(true); // This line is removed
      }, 500);
    };
    initializeApp();
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     const cards = await getAllCards();
  //     console.log("Cartes dans AsyncStorage :", cards);
  //   })();
  // }, []);

  // Focus the title input when modal opens
  useEffect(() => {
    if (isModalVisible && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isModalVisible]);

  // Réinitialiser currentIndex si nécessaire quand les filtres changent
  useEffect(() => {
    const filteredCards = getFilteredCards();
    if (currentIndex >= filteredCards.length && filteredCards.length > 0) {
      setCurrentIndex(0);
    }
    // Réinitialiser la hauteur calculée quand les filtres changent
    // if (filteredCards.length !== cards.length) { // This line is removed
    //   setIsHeightCalculated(false); // This line is removed
    // } // This line is removed
  }, [activeFilters, cards]);

  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          // navigation.goBack(); // ou setModalVisible(false) selon ton usage
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FBFF29" />
      
      {isLoading ? (
        // Vue de chargement complètement séparée - SEUL élément rendu
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" style={{ marginBottom: 20 }} />
          <Text
            style={{
              fontSize: 26,
              fontWeight: "bold",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            Chargement des recommandations...
          </Text>
          <Text style={{ fontSize: 18, textAlign: "center", marginBottom: 15 }}>
            Veuillez patienter pendant le chargement des données.
          </Text>
          <Text style={{ fontSize: 16, textAlign: "center", marginBottom: 30, opacity: 0.7 }}>
            Cela peut prendre quelques secondes.
          </Text>
        </View>
      ) : (
        // Vue normale - SEULEMENT après le chargement
        <>
          {/* Color Strip positioned under header */}
          {getFilteredCards().length > 0 && isHeightCalculated &&(
            <ColorStrip
              colors={enrichCard(getFilteredCards()[currentIndex])?.stripColors || ["#000"]}
              style={styles.colorStrip}
            />
          )}
          {/* Header */}
          <View style={styles.devButton}>
{/*             <TouchableOpacity
              style={styles.loadButton}
              onPress={handleLoadExamples}
            >
              <Ionicons name="cloud-download-outline" size={20} color="#000" />
            </TouchableOpacity>
 */}
            <TouchableOpacity
              style={styles.clearButton}
              onPress={async () => {
                Alert.alert(
                  "Réinitialiser l'application",
                  "Cette action va effacer toutes les données et vous faire refaire l'onboarding. Êtes-vous sûr ?",
                  [
                    {
                      text: "Annuler",
                      style: "cancel"
                    },
                    {
                      text: "Réinitialiser",
                      style: "destructive",
                      onPress: async () => {
                        try {
                          await clearAll();
                          Alert.alert(
                            "Réinitialisation terminée",
                            "L'application va se redémarrer. Veuillez fermer complètement l'app et la rouvrir pour voir l'onboarding.",
                            [
                              {
                                text: "OK",
                                onPress: () => {
                                  // Forcer un redémarrage en vidant le cache
                                  if (Platform.OS === 'ios') {
                                    const Updates = require('expo-updates');
                                    Updates.reloadAsync();
                                  } else {
                                    // Sur Android, on peut essayer de redémarrer
                                    const Updates = require('expo-updates');
                                    Updates.reloadAsync();
                                  }
                                }
                              }
                            ]
                          );
                        } catch (error) {
                          console.error('Erreur lors de la réinitialisation:', error);
                          Alert.alert('Erreur', 'Impossible de réinitialiser l\'application');
                        }
                      }
                    }
                  ]
                );
              }}
            >
              <Ionicons name="trash" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.header}>
            {getFilteredCards().length > 0 && isHeightCalculated && (
              <CategoryPill
                type={enrichCard(getFilteredCards()[currentIndex])?.type}
                color={enrichCard(getFilteredCards()[currentIndex])?.categoryColor}
                icon={enrichCard(getFilteredCards()[currentIndex])?.icon}
              />
            )}
          </View>

          {/* Content Pages */}
          {cards.length === 0 ? (
            <View
              style={[
                styles.page,
                {
                  height: scrollHeight,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 20,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: "bold",
                  marginBottom: 20,
                  textAlign: "center",
                }}
              >
                Bienvenue sur Recomigo 👋
              </Text>
              <Text style={{ fontSize: 18, textAlign: "center", marginBottom: 15 }}>
                L'app pour noter, garder et partager tes recommandations culturelles
                💡
              </Text>
              <Text style={{ fontSize: 16, textAlign: "center", marginBottom: 30 }}>
                Films, séries, musiques, podcasts, vidéos YouTube : tout ce que tu
                aimes, à portée de swipe.
              </Text>
              <TouchableOpacity
                style={styles.loadButton}
                onPress={handleLoadExamples}
              >
                <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                  Charger des exemples
                </Text>
              </TouchableOpacity>
            </View>
          ) : getFilteredCards().length === 0 ? (
            <View
              style={[
                styles.page,
                {
                  height: scrollHeight,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 20,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  marginBottom: 20,
                  textAlign: "center",
                }}
              >
                Aucune carte trouvée 🔍
              </Text>
              <Text style={{ fontSize: 16, textAlign: "center", marginBottom: 15 }}>
                Aucune carte ne correspond aux filtres sélectionnés.
              </Text>
              <Text style={{ fontSize: 14, textAlign: "center", marginBottom: 30, opacity: 0.7 }}>
                Essaie de modifier tes filtres ou d'ajouter de nouvelles cartes.
              </Text>
              <TouchableOpacity
                style={styles.loadButton}
                onPress={resetFilters}
              >
                <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                  Réinitialiser les filtres
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView
              ref={scrollViewRef}
              pagingEnabled
              showsVerticalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              onLayout={handleLayout}
              style={styles.scrollView}
            >
              {isHeightCalculated ? (
                getFilteredCards()
                  .filter((item) => !!item && item.type)
                  .map((item, index) => {
                    const hydrated = enrichCard(item);
                    return (
                      <View
                        key={index}
                        style={[
                          styles.page, 
                          { 
                            height: scrollHeight 
                          }
                        ]}
                      >
                        <ContentCard 
                          item={hydrated} 
                          onEdit={handleCardLongPress}
                          onImageLoad={() => {}}
                        />
                      </View>
                    );
                  })
              ) : (
                <View
                  style={[
                    styles.page,
                    {
                      height: height,
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  ]}
                >
                  <ActivityIndicator size="large" color="#000" />
                </View>
              )}
            </ScrollView>
          )}

          {/* Bottom Buttons */}
          {getFilteredCards().length > 0 && (
            <View style={styles.buttonContainer}>
              {getFilteredCards().length > 0 && (
                <TouchableOpacity 
                  style={styles.shareButton} 
                  onPress={() => {
                    HapticService.buttonPress();
                    handleShare();
                  }}
                >
                  <Text style={styles.ButtonText}>Partager</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={() => {
                  HapticService.buttonPress();
                  toggleModal();
                }}
              >
                <Ionicons name="add" size={20} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.settingsButton} 
                onPress={() => {
                  HapticService.buttonPress();
                  toggleSettingsModal();
                }}
              >
                <Ionicons name="settings" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}

          {/* Modals */}
          <AddCardModal
            isVisible={isModalVisible}
            onClose={() => {
              setModalVisible(false);
            }}
            onSave={async (newCard) => {
              // Mode création : ajouter une nouvelle carte
              await addCard(newCard);
              await loadCards();
              setModalVisible(false);
            }}
          />

          {/* Modal d'édition avec formulaire direct */}
          <Modal
            isVisible={isEditModalVisible}
            onBackdropPress={() => setEditModalVisible(false)}
            style={styles.editFormModal}
            propagateSwipe={false}
            useNativeDriver={true}
            hideModalContentWhileAnimating={true}
          >
            <View style={styles.editFormModalContent}>
              <DragHandle 
                onClose={() => setEditModalVisible(false)}
                style={styles.dragHandleContainer}
              />
              
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
              >
                <MultiStepForm
                  onFinish={async (finalData) => {
                    if (selectedCard) {
                      await updateCard(selectedCard.id, finalData);
                      await loadCards();
                    }
                    setEditModalVisible(false);
                    setSelectedCard(null);
                    setEditFormData(null);
                  }}
                  onCancel={() => {
                    setEditModalVisible(false);
                    setSelectedCard(null);
                    setEditFormData(null);
                  }}
                  initialData={selectedCard}
                  showSaveDeleteButtons={true}
                  onDelete={handleDeleteCard}
                  onChange={(data) => setEditFormData(data)}
                />
              </KeyboardAvoidingView>
            </View>
          </Modal>

          {/* Modal de paramètres avec filtres */}
          <Modal
            isVisible={isSettingsModalVisible}
            onBackdropPress={() => setSettingsModalVisible(false)}
            style={styles.settingsModal}
            propagateSwipe={false}
            useNativeDriver={true}
            hideModalContentWhileAnimating={true}
          >
            <View style={styles.settingsModalContent}>
              <DragHandle 
                onClose={() => setSettingsModalVisible(false)}
                style={styles.dragHandleContainer}
              />
              
              <View style={styles.settingsContent}>
                <View style={styles.settingsHeader}>
                  <Text style={styles.settingsTitle}>Filtres</Text>
                  <TouchableOpacity 
                    style={styles.resetIconButton}
                    onPress={resetFilters}
                  >
                    <Ionicons name="refresh" size={24} color="#F44336" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.filtersContainer}>
                  {Object.entries(activeFilters).map(([category, isActive]) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.filterItem,
                        isActive && styles.filterItemActive
                      ]}
                      onPress={() => handleFilterToggle(category)}
                    >
                      <View style={styles.filterItemContent}>
                        <View style={[
                          styles.filterIcon,
                          { backgroundColor: getCategoryColor(category) }
                        ]}>
                          <Ionicons 
                            name={getCategoryIcon(category)} 
                            size={16} 
                            color="#FFF" 
                          />
                        </View>
                        <Text style={[
                          styles.filterText,
                          isActive && styles.filterTextActive
                        ]}>
                          {category}
                        </Text>
                      </View>
                      <Ionicons 
                        name={isActive ? "checkmark-circle" : "ellipse-outline"} 
                        size={24} 
                        color={isActive ? "#4CAF50" : "#CCC"} 
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </Modal>

          {/* Onboarding Modal */}
          {/* Removed Onboarding component */}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFF29",
  },
  header: {
    backgroundColor: "#FBFF29",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    position: "absolute",
    top: isIOS ? 50 : 0,
    height: 70,
    left: 0,
    right: 0,
    zIndex: 5,
  },

  colorStripContainer: {
    position: "absolute",
    top: isIOS ? 60 : 0,
    right: 100,
    height: "100%",
    width: 80,
    flexDirection: "row",
    zIndex: 15,
  },
  colorBand: { flex: 1 },

  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  categoryText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    position: "relative",
    zIndex: 15,
  },
  page: {
    paddingHorizontal: 10,
    paddingTop: 61,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 50,
    borderColor: "#000",
    borderWidth: 2,
    padding: 8,
  },
  card: {
    flex: 1,
    justifyContent: "flex-end",
    borderRadius: 40,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    borderColor: "#000",
    borderWidth: 2,
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  blurWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "80%",
  },
  contentInfo: {
    position: "absolute",
    bottom: 25,
    left: 25,
    right: 25,
  },
  contentTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  contentSubtitle: {
    fontSize: 16,
    color: "#FFF",
    marginBottom: 4,
    opacity: 0.9,
  },
  contentDescription: {
    fontSize: 16,
    color: "#FFF",
    lineHeight: 22,
    marginTop: 12,
    marginBottom: 8,
    fontStyle: "italic",
  },
  recommendedBy: {
    fontSize: 14,
    marginBottom: 20,
  },
  discoverButton: {
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  discoverButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    gap: 10,
  },
  shareButton: {
    flex: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    marginBottom: 20,
    marginTop: 15,
    paddingVertical: 15,
    borderRadius: 25,
    height: 58,
    position: "relative",
    zIndex: 15,
  },
  addButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    marginBottom: 20,
    marginTop: 15,
    paddingVertical: 15,
    borderRadius: 99,
    height: 58,
    position: "relative",
    zIndex: 15,
  },
  settingsButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    marginBottom: 20,
    marginTop: 15,
    paddingVertical: 15,
    borderRadius: 99,
    height: 58,
    position: "relative",
    zIndex: 15,
  },
  ButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    minHeight: "90%",
    maxHeight: "95%",
  },
  dragHandle: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#CCC",
    alignSelf: "center",
    marginBottom: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },

  // pour phase de dev
  devButton: {
    flexDirection: "row",
    zIndex: 99,
    position: "absolute",
    top: 50,
    right: 20,
  },
  loadButton: {
    backgroundColor: "#43A047",
    padding: 10,
    borderRadius: 50,
    marginHorizontal: 5,
  },
  clearButton: {
    backgroundColor: "#FFEB3B",
    padding: 10,
    borderRadius: 50,
    marginHorizontal: 5,
  },
  popup: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 28,
    alignItems: "center",
  },
  popupText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 18,
  },
  popupButton: {
    backgroundColor: "#E53935",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 8,
    marginTop: 10,
  },
  editModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  editModalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    minHeight: "80%",
    maxHeight: "90%",
  },
  editModalScrollContent: {
    paddingBottom: 20, // Add some padding at the bottom to allow content to scroll
  },
  editModalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  editButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F44336",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  deleteButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#607D8B",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  cancelButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
  dragHandleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: "100%",
  },
  editFormModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  editFormModalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    height: "95%",
  },
  settingsModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  settingsModalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    height: "95%",
  },
  settingsContent: {
    flex: 1,
    paddingTop: 20,
  },
  settingsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  resetIconButton: {
    padding: 5,
  },
  filtersContainer: {
    flex: 1,
    marginBottom: 30,
  },
  filterItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#F0F0F0",
  },
  filterItemActive: {
    backgroundColor: "#E0F2F7",
    borderColor: "#4CAF50",
    borderWidth: 1,
  },
  filterItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  filterText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  filterTextActive: {
    color: "#4CAF50",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FBFF29",
    paddingHorizontal: 20,
  },
});
