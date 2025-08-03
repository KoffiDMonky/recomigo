import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

export default function CategoryPill({ type, color, icon }) {
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
    <View style={[styles.categoryPill, { backgroundColor: color }]}>
      <Ionicons 
        name={getCategoryIcon(type)} 
        size={16} 
        color="#FFF" 
        style={styles.categoryIcon}
      />
      <Text style={styles.categoryText}>{type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  categoryText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});