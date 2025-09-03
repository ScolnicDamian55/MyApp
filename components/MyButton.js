import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function MyButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor:'#3498db',
    padding: 12,
    borderRadius: 8,
    minWidth: 191,
    alignItems: 'center'
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight:'bold'
  },
});
