import * as Haptics from 'expo-haptics';

class HapticService {
  // Feedback léger pour les interactions subtiles
  static light() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  // Feedback moyen pour les actions importantes
  static medium() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  // Feedback fort pour les actions critiques
  static heavy() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }

  // Feedback de succès
  static success() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  // Feedback d'erreur
  static error() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }

  // Feedback d'avertissement
  static warning() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }

  // Feedback de sélection
  static selection() {
    Haptics.selectionAsync();
  }

  // Méthodes spécifiques pour les actions de l'app
  static cardSwipe() {
    this.light();
  }

  static cardLike() {
    this.medium();
  }

  static cardShare() {
    this.light();
  }

  static cardDelete() {
    this.heavy();
  }

  static buttonPress() {
    this.light();
  }

  static modalOpen() {
    this.medium();
  }

  static filterChange() {
    this.light();
  }
}

export default HapticService; 