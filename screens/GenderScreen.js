import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function GenderScreen({ navigation }) {
  const [selectedGender, setSelectedGender] = useState(null);

  const handleContinue = () => {
    if (!selectedGender) {
      Alert.alert('Выберите пол', 'Пожалуйста, выберите ваш пол чтобы продолжить.');
      return;
    }
    navigation.navigate('Age', { gender: selectedGender });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Какой у вас пол?</Text>
      <Text style={styles.title1}>Пол Влияет на естественое потребление калорий.</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.genderButton,
            selectedGender === 'Мужской' && styles.selectedButton
          ]}
          onPress={() => setSelectedGender('Мужской')}
        >
          <Text style={styles.buttonText}>Мужской</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.genderButton,
            selectedGender === 'Женский' && styles.selectedButton
          ]}
          onPress={() => setSelectedGender('Женский')}
        >
          <Text style={styles.buttonText}>Женский</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>Продолжить</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems:'center',
    padding:20,
    backgroundColor:'#f0f0f0',
    justifyContent:'space-between',
    paddingVertical:75
  },
  title: {
    fontSize:26,
    fontWeight:'bold',
    paddingBottom:10,
  },
  title1: {
    fontSize:20,
    paddingBottom:100,
    textAlign:'center'
  },
  buttonsContainer: {
    flexDirection:'row',
    marginBottom:50
  },
  genderButton: {
    backgroundColor:'gray',
    padding:15,
    marginHorizontal:10,
    borderRadius:10,
  },
  selectedButton: {
    backgroundColor:'#2ecc71'
  },
  buttonText: {
    color:'white',
    fontSize:18,
  },
  continueButton: {
    backgroundColor:'#2ecc71',
    paddingVertical:12,
    paddingHorizontal:40,
    borderRadius:10
  },
  continueText: {
    color:'white',
    fontSize:18,
    fontWeight:'bold'
  }
});
