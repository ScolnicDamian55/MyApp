import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function AgeScreen({ navigation, route }) {
  const [age, setAge] = useState('');

  const handleContinue = () => {
    const numericAge = parseInt(age);

    if (!numericAge || numericAge < 5 || numericAge > 120) {
      Alert.alert('Ошибка', 'Введите корректный возраст (от 5 до 120).');
      return;
    }

    // Получаем выбранный пол из предыдущего экрана (если передавали)
    const { gender } = route.params || {};

    // Передаём данные дальше на HomeScreen
    navigation.navigate('Body', { gender, age: numericAge });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Сколько Вам Лет?</Text>
      <Text style={styles.title1}>Потребность в калориях зависит от возраста.</Text>
      <TextInput
        style={styles.input}
        placeholder="Введите возраст"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
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
  },
  title: {
    fontSize:26,
    fontWeight:'bold',
    paddingBottom:10,
    marginBottom:40,
  },
  title1: {
    fontSize:20,
    marginBottom:40,
    paddingBottom:100,
    textAlign:'center'
  },
  input: {
    width:'80%',
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:10,
    padding:12,
    fontSize:18,
    textAlign:'center',
    marginBottom:421,
    backgroundColor:'#fff'
  },
  button: {
    backgroundColor:'#3498db',
    paddingVertical:12,
    paddingHorizontal:40,
    borderRadius:10
  },
  buttonText: {
    color:'white',
    fontSize:18,
    fontWeight:'bold'
  }
});
