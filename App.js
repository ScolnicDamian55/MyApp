import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './services/firebase';

import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
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
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome"  component={WelcomeScreen} />
      <Stack.Screen name="Login"    component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Gender"       component={GenderScreen} />
      <Stack.Screen name="Age"          component={AgeScreen} />
      <Stack.Screen name="Body"         component={BodyScreen} />
      <Stack.Screen name="Weight"       component={WeightScreen} />
      <Stack.Screen name="Activity"     component={ActivityScreen} />
      <Stack.Screen name="Plan"         component={PlanScreen} />
      <Stack.Screen name="TrainingAsk"  component={TrainingAskScreen} />
      <Stack.Screen name="TrainingPlan" component={TrainingPlanScreen} />
      <Stack.Screen name="Home"         component={HomeScreen} />
      <Stack.Screen name="PhotoTrack"   component={PhotoTrackScreen} />
      <Stack.Screen name="MyTraining"   component={MyTrainingScreen} />
      <Stack.Screen name="Profile"      component={ProfileScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home"         component={HomeScreen} />
      <Stack.Screen name="PhotoTrack"   component={PhotoTrackScreen} />
      <Stack.Screen name="MyTraining"   component={MyTrainingScreen} />
      <Stack.Screen name="Profile"      component={ProfileScreen} />
      <Stack.Screen name="Gender"       component={GenderScreen} />
      <Stack.Screen name="Age"          component={AgeScreen} />
      <Stack.Screen name="Body"         component={BodyScreen} />
      <Stack.Screen name="Weight"       component={WeightScreen} />
      <Stack.Screen name="Activity"     component={ActivityScreen} />
      <Stack.Screen name="Plan"         component={PlanScreen} />
      <Stack.Screen name="TrainingAsk"  component={TrainingAskScreen} />
      <Stack.Screen name="TrainingPlan" component={TrainingPlanScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setOnboardingDone(userDoc.data().onboardingDone || false);
          }
        } catch (e) {
          console.warn('Ошибка загрузки профиля:', e);
        }
        setUser(currentUser);
      } else {
        setUser(null);
        setOnboardingDone(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F6FB' }}>
        <ActivityIndicator size="large" color="#4A7BF7" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user
        ? <AuthStack />
        : !onboardingDone
          ? <OnboardingStack />
          : <AppStack />
      }
    </NavigationContainer>
  );
}