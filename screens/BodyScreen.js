import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function BodyScreen({ navigation, route }) {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const handleContinue = () => {
    const numericHeight = parseInt(height);
    const numericWeight = parseInt(weight);

    if (!numericHeight || numericHeight < 50 || numericHeight > 250) {
      Alert.alert('Ошибка', 'Введите корректный рост (от 50 до 250 см).');
      return;
    }

    if (!numericWeight || numericWeight < 20 || numericWeight > 300) {
      Alert.alert('Ошибка', 'Введите корректный вес (от 20 до 300 кг).');
      return;
    }

    const { gender, age } = route.params || {};

    navigation.navigate('Home', { gender, age, height: numericHeight, weight: numericWeight });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Введите ваш рост и вес</Text>

      <TextInput
        style={styles.input}
        placeholder="Рост (см)"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />

      <TextInput
        style={styles.input}
        placeholder="Вес (кг)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Продолжить</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    padding:20,
    backgroundColor:'#f9f9f9'
  },
  title: {
    fontSize:26,
    fontWeight:'bold',
    marginBottom:30
  },
  input: {
    width:'80%',
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:10,
    padding:12,
    fontSize:18,
    textAlign:'center',
    marginBottom:20,
    backgroundColor:'#fff'
  },
  button: {
    backgroundColor:'#2ecc71',
    paddingVertical:12,
    paddingHorizontal:40,
    borderRadius:10,
    marginTop:20
  },
  buttonText: {
    color:'white',
    fontSize:18,
    fontWeight:'bold'
  }
});
