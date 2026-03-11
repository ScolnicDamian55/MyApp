import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import GenderScreen from './screens/GenderScreen';
import AgeScreen from './screens/AgeScreen';
import BodyScreen from './screens/BodyScreen';
import WeightScreen from './screens/WeightScreen';
import ActivityScreen from './screens/ActivityScreen';
import PlanScreen from './screens/PlanScreen';
import TrainingAskScreen from './screens/TrainingAskScreen';
import TrainingPlanScreen from './screens/TrainingPlanScreen';
import PhotoTrackScreen from './screens/PhotoTrackScreen';
import MyTrainingScreen from './screens/MyTrainingScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome"      component={WelcomeScreen}      options={{ headerShown: false }} />
        <Stack.Screen name="Home"         component={HomeScreen}         options={{ headerShown: false }} />
        <Stack.Screen name="Gender"       component={GenderScreen}       options={{ headerShown: false }} />
        <Stack.Screen name="Age"          component={AgeScreen}          options={{ headerShown: false }} />
        <Stack.Screen name="Body"         component={BodyScreen}         options={{ headerShown: false }} />
        <Stack.Screen name="Weight"       component={WeightScreen}       options={{ headerShown: false }} />
        <Stack.Screen name="Activity"     component={ActivityScreen}     options={{ headerShown: false }} />
        <Stack.Screen name="Plan"         component={PlanScreen}         options={{ headerShown: false }} />
        <Stack.Screen name="TrainingAsk"  component={TrainingAskScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="TrainingPlan" component={TrainingPlanScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PhotoTrack"   component={PhotoTrackScreen}   options={{ headerShown: false }} />
        <Stack.Screen name="MyTraining"   component={MyTrainingScreen}   options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}