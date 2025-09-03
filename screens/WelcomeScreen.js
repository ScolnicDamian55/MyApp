import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import MyButton from '../components/MyButton';

export default function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground 
      source={require('../assets/logo.png')} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Знай, что ты ешь</Text>
        <MyButton
          title="Продолжить"
          onPress={() => navigation.navigate('Gender')}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    width:'100%',
    height:'100%',
  },
  overlay: {
  flex:1,
  justifyContent:'space-between',
  paddingVertical:50,
  alignItems:'center',
  width:'100%',
  backgroundColor:'rgba(0,0,0,0.3)',
},
  title: {
    fontSize:28,
    fontWeight:'bold',
    color:'white',
    textAlign:'center',
    marginBottom:30,
    marginTop:20,
  }
});
