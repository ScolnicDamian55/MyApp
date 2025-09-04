import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function WeightScreen({ navigation, route }) {
  const [weight, setWeight] = useState('');

  const handleContinue = () => {
    const numericWeight = parseFloat(weight);

    if (!numericWeight || numericWeight < 20 || numericWeight > 300) {
      Alert.alert('Ошибка', 'Введите корректный вес (от 20 до 300 кг).');
      return;
    }

    // Получаем данные с предыдущих экранов
    const { gender, age, height } = route.params || {};

    // Передаем все данные дальше, например на HomeScreen
    navigation.navigate('Home', { gender, age, height, weight: numericWeight });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Какой ваш желаемый вес?</Text>
      <Text style={styles.subtitle}>Введите вес в килограммах</Text>

      <TextInput
        style={styles.input}
        placeholder="Введите вес"
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
    alignItems:'center',
    padding:20,
    backgroundColor:'#f9f9f9',
    justifyContent:'space-between',
    paddingVertical:75
  },
  title: {
    fontSize:26,
    fontWeight:'bold',
    marginBottom:10,
    textAlign:'center',
  },
  subtitle: {
    fontSize:18,
    marginBottom:30,
    textAlign:'center',
  },
  input: {
    width:'80%',
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:10,
    padding:12,
    fontSize:18,
    textAlign:'center',
    marginBottom:40,
    backgroundColor:'#fff',
  },
  button: {
    backgroundColor:'#2ecc71',
    paddingVertical:12,
    paddingHorizontal:40,
    borderRadius:10,
  },
  buttonText: {
    color:'white',
    fontSize:18,
    fontWeight:'bold',
  },
});
