import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, StatusBar, ScrollView, Switch, Alert,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const BLUE = '#4A7BF7';
const DARK = '#1A1A2E';

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [reminder, setReminder] = useState(false);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();

    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    } catch (e) {
      console.warn('Ошибка загрузки профиля:', e);
    }
  };

  const handleLogout = () => {
  Alert.alert(
    'Выйти из аккаунта',
    'Вы уверены что хотите выйти?',
    [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth);
          } catch (e) {
            console.warn('Ошибка выхода:', e);
          }
        },
      },
    ]
  );
};

  const goalDirection = userData
    ? userData.desiredWeight > userData.currentWeight
      ? '📈 Набор массы'
      : userData.desiredWeight < userData.currentWeight
        ? '📉 Похудение'
        : '⚖️ Поддержание'
    : '—';

  // Расчёт даты окончания
  const getEndDate = () => {
    if (!userData?.termText || userData.termText === '—') return '—';
    const months = parseInt(userData.termText);
    if (isNaN(months)) return '—';
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date.toLocaleString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const rows = userData ? [
    { label: 'Имя', value: userData.name || '—' },
    { label: 'Пол', value: userData.gender || '—' },
    { label: 'Возраст', value: userData.age ? `${userData.age}` : '—' },
    { label: 'Рост', value: userData.height ? `${userData.height} см` : '—' },
    { label: 'Вес', value: userData.currentWeight ? `${userData.currentWeight} кг` : '—' },
    { label: 'Цель по весу', value: userData.desiredWeight ? `${userData.desiredWeight} кг` : '—' },
    { label: 'Уровень активности', value: userData.activity || '—' },
    { label: 'Цель', value: goalDirection },
    { label: 'Срок', value: userData.termText || '—' },
    { label: 'Дата начала', value: new Date().toLocaleString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) },
    { label: 'Дата окончания', value: getEndDate() },
  ] : [];

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.bgBlob1} />
      <View style={styles.bgBlob2} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Профиль</Text>
            <View style={{ width: 42 }} />
          </View>

          {/* Avatar */}
          <View style={styles.avatarSection}>
  <View style={styles.avatar}>
    <Text style={styles.avatarIcon}>👤</Text>
  </View>
  <Text style={styles.userName}>{userData?.name || 'Пользователь'}</Text>
  <Text style={styles.userEmail}>{auth.currentUser?.email || '—'}</Text>
  <View style={styles.caloriesBadge}>
    <Text style={styles.caloriesText}>
      🔥 {userData?.targetCalories || '—'} ккал / день
    </Text>
  </View>
</View>

          {/* Profile card */}
          <View style={styles.card}>
            {/* Reminder toggle */}
            <View style={[styles.row, styles.rowBorder]}>
              <Text style={styles.rowLabel}>Включить напоминание</Text>
              <Switch
                value={reminder}
                onValueChange={setReminder}
                trackColor={{ false: '#E4E9F5', true: BLUE }}
                thumbColor="#fff"
              />
            </View>

            {/* Data rows */}
            {rows.map((row, i) => (
              <View
                key={row.label}
                style={[styles.row, i < rows.length - 1 && styles.rowBorder]}
              >
                <Text style={styles.rowLabel}>{row.label}</Text>
                <View style={styles.rowRight}>
                  <Text style={styles.rowValue}>{row.value}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Logout button */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
            <Text style={styles.logoutText}>Выйти из аккаунта</Text>
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F6FB' },
  bgBlob1: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(74,123,247,0.08)', top: -80, right: -80,
  },
  bgBlob2: {
    position: 'absolute', width: 240, height: 240, borderRadius: 120,
    backgroundColor: 'rgba(74,247,160,0.07)', bottom: 80, left: -70,
  },

  scroll: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 40 },

  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 28,
  },
  backBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: DARK, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  backArrow: { fontSize: 18, color: DARK, marginBottom: 6 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: DARK, },

  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: '#EEF3FF', alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
    shadowColor: BLUE, shadowOpacity: 0.15, shadowRadius: 12, elevation: 4,
  },
  userName: { 
  fontSize: 20, fontWeight: '800', color: DARK, marginBottom: 4 
  },
  avatarIcon: { fontSize: 40 },
  userEmail: { fontSize: 14, color: '#8E9BB5', marginBottom: 10 },
  caloriesBadge: {
    backgroundColor: '#EEF3FF', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 7,
  },
  caloriesText: { fontSize: 13, fontWeight: '700', color: BLUE },

  card: {
    backgroundColor: '#fff', borderRadius: 20,
    shadowColor: DARK, shadowOpacity: 0.07, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 3,
    marginBottom: 16, overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#F0F2F8' },
  rowLabel: { fontSize: 14, color: DARK, fontWeight: '500' },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowValue: { fontSize: 14, fontWeight: '700', color: DARK },
  rowChevron: { fontSize: 18, color: '#B0BACE' },

  logoutBtn: {
    backgroundColor: '#FFF0F0', borderRadius: 16,
    paddingVertical: 16, alignItems: 'center',
    borderWidth: 1.5, borderColor: '#F76A6A',
  },
  logoutText: { fontSize: 16, fontWeight: '700', color: '#F76A6A' },
});