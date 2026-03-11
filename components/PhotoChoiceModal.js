import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function PhotoChoiceModal({ visible, onClose, onCamera, onLibrary, onSkip }) {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Добавить фото</Text>
          <Text style={styles.sub}>Выберите действие</Text>

          <TouchableOpacity style={styles.action} onPress={() => { onCamera(); onClose(); }}>
            <Text style={styles.actionText}>Сделать фото</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.action} onPress={() => { onLibrary(); onClose(); }}>
            <Text style={styles.actionText}>Выбрать из галереи</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.action} onPress={() => { onSkip && onSkip(); onClose(); }}>
            <Text style={styles.actionText}>Продолжить без фото</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>Отмена</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'flex-end' },
  card: { backgroundColor:'#fff', padding:20, borderTopLeftRadius:12, borderTopRightRadius:12 },
  title: { fontSize:18, fontWeight:'700', marginBottom:4 },
  sub: { color:'#666', marginBottom:12 },
  action: { backgroundColor:'#f2f2f2', padding:14, borderRadius:10, marginBottom:10, alignItems:'center' },
  actionText: { fontSize:16 },
  cancel: { padding:12, alignItems:'center' },
  cancelText: { color:'#007AFF', fontSize:16 }
});
