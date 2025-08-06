import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

const CATEGORIES = ["Film", "Série", "Musique", "Podcast", "Youtube"];

export default function CategoryStep({ formData = {}, onChange, onNext, onBack }) {

const handleSelect = (category) => {
  const updated = { ...formData, type: category };
  onChange(updated);
};

const getCategoryColor = (category) => {
  const colors = {
    Film: "#E74C3C",
    "Série": "#3498DB",
    Musique: "#9B59B6",
    Podcast: "#F39C12",
    Youtube: "#E74C3C",
  };
  return colors[category] || "#CCC";
};

const getCategoryIcon = (category) => {
  const icons = {
    Film: "film",
    "Série": "tv",
    Musique: "musical-notes",
    Podcast: "radio",
    Youtube: "logo-youtube",
  };
  return icons[category] || "help-circle";
};

  return (
    <View style={styles.container}>
      <View style={styles.categoryContainer}>
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryItem,
              formData.type === category && styles.categoryItemActive
            ]}
            onPress={() => handleSelect(category)}
          >
            <View style={styles.categoryItemContent}>
              <View style={[
                styles.categoryIcon,
                { backgroundColor: getCategoryColor(category) }
              ]}>
                <Ionicons 
                  name={getCategoryIcon(category)} 
                  size={16} 
                  color="#FFF" 
                />
              </View>
              <Text style={[
                styles.categoryText,
                formData.type === category && styles.categoryTextActive
              ]}>
                {category}
              </Text>
            </View>
            <Ionicons 
              name={formData.type === category ? "checkmark-circle" : "ellipse-outline"} 
              size={24} 
              color={formData.type === category ? "#4CAF50" : "#CCC"} 
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  categoryContainer: {
    flex: 1,
    marginBottom: 30,
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#F0F0F0",
  },
  categoryItemActive: {
    backgroundColor: "#E0F2F7",
    borderColor: "#4CAF50",
    borderWidth: 1,
  },
  categoryItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  categoryTextActive: {
    color: "#4CAF50",
  },
});  