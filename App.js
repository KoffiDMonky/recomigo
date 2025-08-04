import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeScreen from "./screens/HomeScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import DeepLinkService from "./services/DeepLinkService";

const Stack = createStackNavigator();

export default function App() {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(null);

  useEffect(() => {
    // Initialiser le service de deep linking
    DeepLinkService.init();
    
    // Vérifier si l'onboarding est terminé
    checkOnboardingStatus();
    
    // Surveiller les changements dans AsyncStorage
    const checkOnboardingInterval = setInterval(async () => {
      try {
        const onboardingCompleted = await AsyncStorage.getItem('onboarding_completed');
        if (onboardingCompleted === 'true' && !isOnboardingCompleted) {
          setIsOnboardingCompleted(true);
        }
      } catch (error) {
        console.error('Erreur vérification onboarding:', error);
      }
    }, 500);

    // Cleanup à la fermeture de l'app
    return () => {
      DeepLinkService.cleanup();
      clearInterval(checkOnboardingInterval);
    };
  }, [isOnboardingCompleted]);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem('onboarding_completed');
      setIsOnboardingCompleted(onboardingCompleted === 'true');
    } catch (error) {
      console.error('Erreur vérification onboarding:', error);
      setIsOnboardingCompleted(false);
    }
  };

  // Afficher un écran de chargement pendant la vérification
  if (isOnboardingCompleted === null) {
    return null; // ou un écran de chargement
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isOnboardingCompleted ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <Stack.Screen name="Home" component={HomeScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}