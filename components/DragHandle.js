import React from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';

export default function DragHandle({ onClose, style }) {
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      // Démarrer seulement si on glisse vers le bas
      return gestureState.dy > 5;
    },
    onPanResponderRelease: (_, gestureState) => {
      // Si on a glissé vers le bas de plus de 100px, fermer le modal
      if (gestureState.dy > 100) {
        onClose();
      }
    },
  });

  return (
    <View 
      style={[styles.container, style]}
      {...panResponder.panHandlers}
    >
      <View style={styles.dragHandle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80, // Encore plus grand
    width: '100%',
    // Zone de touch plus large
    paddingVertical: 20,
  },
  dragHandle: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CCC',
  },
}); 