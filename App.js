import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect } from "react";
import HomeScreen from "./screens/HomeScreen";
import DeepLinkService from "./services/DeepLinkService";

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    // Initialiser le service de deep linking
    DeepLinkService.init();
    
    // Cleanup à la fermeture de l'app
    return () => {
      DeepLinkService.cleanup();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}