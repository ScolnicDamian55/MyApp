import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import GenderScreen from './screens/GenderScreen';
import AgeScreen from './screens/AgeScreen';
import BodyScreen from './screens/BodyScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Главная' }}
        />
        <Stack.Screen
          name="Gender"
          component={GenderScreen}
          options={{ title: 'Ваш пол' }}
        />
        <Stack.Screen
          name="Age"
          component={AgeScreen}
          options={{ title: 'Возраст' }}
        />
        <Stack.Screen
          name="Body"
          component={BodyScreen}
          options={{ title: 'Рост и вес' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
