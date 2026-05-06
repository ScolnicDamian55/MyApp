import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, StatusBar, Dimensions,
  Modal, Image, ActivityIndicator, ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import PhotoChoiceModal from '../components/PhotoChoiceModal';
import { analyzeFoodPhoto } from '../services/FoodAI';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const { width, height } = Dimensions.get('window');
const BLUE = '#4A7BF7';
const DARK = '#1A1A2E';
const DAYS = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

export default function HomeScreen({ route, navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [analysisVisible, setAnalysisVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [meals, setMeals] = useState([]);
  const [userData, setUserData] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fabScale = useRef(new Animated.Value(0)).current;
  const sheetAnim = useRef(new Animated.Value(300)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  const params = route.params || {};
  const nestedPlan = params.plan || {};
  const goalCalories = userData?.targetCalories || 0;

  const eaten = meals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const remaining = goalCalories - eaten;
  const progress = Math.min(eaten / goalCalories, 1);
  const protein = meals.reduce((sum, m) => sum + (m.protein || 0), 0);
  const carbs = meals.reduce((sum, m) => sum + (m.carbs || 0), 0);
  const fat = meals.reduce((sum, m) => sum + (m.fat || 0), 0);

  const today = new Date();
  const todayDay = today.getDay();
  const dayOfMonth = today.getDate();

  useEffect(() => {
  async function loadUserData() {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setMeals(userDoc.data().meals || []); // если хранишь приёмы пищи
        }
      }
    } catch (e) {
      console.warn('Ошибка загрузки профиля:', e);
    }
  }
  loadUserData();

  Animated.parallel([
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    Animated.spring(fabScale, { toValue: 1, delay: 400, friction: 5, useNativeDriver: true }),
  ]).start();
}, []);

  const openAnalysis = (uri) => {
    setCurrentImage(uri);
    setResult(null);
    setError(null);
    setAnalysisVisible(true);
    Animated.spring(sheetAnim, { toValue: 0, friction: 8, useNativeDriver: true }).start();
    runAnalysis(uri);
  };

  const closeAnalysis = () => {
    Animated.timing(sheetAnim, { toValue: 300, duration: 250, useNativeDriver: true })
      .start(() => setAnalysisVisible(false));
  };

  const runAnalysis = async (uri) => {
    setLoading(true);
    setError(null);
    console.log('runAnalysis вызван с uri:', uri);
    try {
      const data = await analyzeFoodPhoto(uri);
      console.log('Результат analyzeFoodPhoto:', data);
      if (data) setResult(data);
      else setError('Не удалось распознать блюдо. Попробуйте ещё раз.');
    } catch (e) {
      console.error('runAnalysis ошибка:', e.message);
      setError('Ошибка: ' + e.message);
    }
    setLoading(false);
  };

  const handleAddMeal = () => {
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.94, duration: 90, useNativeDriver: true }),
      Animated.timing(btnScale, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      if (result) setMeals((prev) => [...prev, result]);
      closeAnalysis();
    });
  };

  const onLaunchCamera = async () => {
    setModalVisible(false);

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Нужен доступ к камере');
      return;
    }

    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    console.log('Camera result:', res);

    if (!res.canceled && res.assets?.[0]?.uri) {
      openAnalysis(res.assets[0].uri);
    }
  };

  const onLaunchLibrary = async () => {
    setModalVisible(false);

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Нужен доступ к галерее');
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    console.log('Library result:', res);

    if (!res.canceled && res.assets?.[0]?.uri) {
      openAnalysis(res.assets[0].uri);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.bgBlob1} />
      <View style={styles.bgBlob2} />

      <ScrollView style={styles.inner} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>Добрый день 👋</Text>
              <Text style={styles.dateTitle}>
                {today.toLocaleString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.avatarBtn}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.avatarText}>👤</Text>
            </TouchableOpacity>
          </View>

          {/* Week strip */}
          <View style={styles.weekRow}>
            {DAYS.map((d, i) => {
              const isActive = i === ((todayDay + 6) % 7);
              return (
                <View key={i} style={[styles.dayPill, isActive && styles.dayPillActive]}>
                  <Text style={[styles.dayText, isActive && styles.dayTextActive]}>{d}</Text>
                  <Text style={[styles.dayNum, isActive && styles.dayNumActive]}>
                    {dayOfMonth - ((todayDay + 6) % 7) + i}
                  </Text>
                  {isActive && <View style={styles.dayDot} />}
                </View>
              );
            })}
          </View>

          {/* Ring card */}
          <View style={styles.ringCard}>
            <View style={styles.ringCardLeft}>
              <Text style={styles.ringLabel}>Осталось</Text>
              <Text style={styles.ringValue}>{remaining}</Text>
              <Text style={styles.ringUnit}>ккал</Text>
              <View style={styles.macrosCol}>
                {[
                  { label: 'Белки', val: protein, color: '#4A7BF7' },
                  { label: 'Углеводы', val: carbs, color: '#F7A84A' },
                  { label: 'Жиры', val: fat, color: '#F76A6A' },
                ].map((m) => (
                  <View key={m.label} style={styles.macroRow}>
                    <View style={[styles.macroDot, { backgroundColor: m.color }]} />
                    <Text style={styles.macroLabel}>{m.label}</Text>
                    <Text style={styles.macroVal}>{m.val} г</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.ringWrap}>
              <View style={styles.ringOuter}>
                <View style={styles.ringInner}>
                  <Text style={styles.ringPercent}>{Math.round(progress * 100)}%</Text>
                  <Text style={styles.ringSubtext}>съедено</Text>
                </View>
              </View>
              <View style={styles.ringStats}>
                <View style={styles.ringStat}>
                  <Text style={styles.ringStatVal}>{eaten}</Text>
                  <Text style={styles.ringStatLabel}>Съедено</Text>
                </View>
                <View style={styles.ringStatDiv} />
                <View style={styles.ringStat}>
                  <Text style={styles.ringStatVal}>{goalCalories}</Text>
                  <Text style={styles.ringStatLabel}>Цель</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              { icon: '🔥', label: 'Калории', val: `${goalCalories} ккал` },
              { icon: '💧', label: 'Вода', val: '0 / 8 ст' },
              { icon: '🏃', label: 'Шаги', val: '—' },
            ].map((s) => (
              <View key={s.label} style={styles.statCard}>
                <Text style={styles.statIcon}>{s.icon}</Text>
                <Text style={styles.statVal}>{s.val}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Meals list */}
          <View style={styles.mealsCard}>
            <Text style={styles.mealsTitle}>Приёмы пищи</Text>
            {meals.length === 0 ? (
              <Text style={styles.mealsEmpty}>Нажмите «+» чтобы добавить еду</Text>
            ) : (
              meals.map((meal, i) => (
                <View key={i} style={styles.mealItem}>
                  <View style={styles.mealLeft}>
                    <Text style={styles.mealName}>{meal.dish}</Text>
                    <Text style={styles.mealMeta}>~{meal.weight}г</Text>
                  </View>
                  <View style={styles.mealRight}>
                    <Text style={styles.mealCal}>{meal.calories} ккал</Text>
                    <Text style={styles.mealMacro}>
                      Б{meal.protein} У{meal.carbs} Ж{meal.fat}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>

        </Animated.View>
      </ScrollView>

      {/* FAB */}
      <Animated.View style={[styles.fabWrap, { transform: [{ scale: fabScale }] }]}>
        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)} activeOpacity={0.85}>
          <Text style={styles.fabPlus}>+</Text>
        </TouchableOpacity>
      </Animated.View>

      <PhotoChoiceModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCamera={onLaunchCamera}
        onLibrary={onLaunchLibrary}
      />

      {/* Analysis Modal */}
      <Modal visible={analysisVisible} transparent animationType="none">
        <View style={styles.modalOverlay}>
          {/* Фото */}
          {currentImage && (
            <Image source={{ uri: currentImage }} style={styles.modalImage} resizeMode="cover" />
          )}
          <View style={styles.modalDark} />

          {/* Кнопка закрыть */}
          <TouchableOpacity style={styles.closeBtn} onPress={closeAnalysis}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>

          {/* Sheet */}
          <Animated.View style={[styles.analysisSheet, { transform: [{ translateY: sheetAnim }] }]}>
            <View style={styles.handle} />

            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

              {/* Загрузка */}
              {loading && (
                <View style={styles.loadingWrap}>
                  <ActivityIndicator size="large" color={BLUE} />
                  <Text style={styles.loadingTitle}>ИИ анализирует блюдо...</Text>
                  <Text style={styles.loadingSubtitle}>Подождите 10–30 секунд</Text>
                </View>
              )}

              {/* Ошибка */}
              {error && !loading && (
                <View style={styles.errorWrap}>
                  <Text style={styles.errorIcon}>😕</Text>
                  <Text style={styles.errorTitle}>Не удалось распознать</Text>
                  <Text style={styles.errorText}>{error}</Text>
                  <TouchableOpacity style={styles.retryBtn} onPress={() => runAnalysis(currentImage)}>
                    <Text style={styles.retryText}>Попробовать снова</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Результат */}
              {result && !loading && (
                <>
                  <Text style={styles.dishName}>{result.dish}</Text>
                  <Text style={styles.dishMeta}>
                    ~{result.weight}г · уверенность {Math.round((result.confidence || 0) * 100)}%
                  </Text>

                  <View style={styles.macroGrid}>
                    {[
                      { val: result.calories, label: 'ккал', bg: '#FFF3ED' },
                      { val: `${result.protein}г`, label: 'белки', bg: '#EEF3FF' },
                      { val: `${result.carbs}г`, label: 'углеводы', bg: '#FFF7ED' },
                      { val: `${result.fat}г`, label: 'жиры', bg: '#FFF0F5' },
                    ].map((m) => (
                      <View key={m.label} style={[styles.macroCard, { backgroundColor: m.bg }]}>
                        <Text style={styles.macroCardVal}>{m.val}</Text>
                        <Text style={styles.macroCardLabel}>{m.label}</Text>
                      </View>
                    ))}
                  </View>

                  <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                    <TouchableOpacity style={styles.saveBtn} onPress={handleAddMeal} activeOpacity={0.9}>
                      <Text style={styles.saveBtnText}>Добавить в дневник ✓</Text>
                    </TouchableOpacity>
                  </Animated.View>
                </>
              )}

              <TouchableOpacity style={styles.retakeBtn} onPress={closeAnalysis}>
                <Text style={styles.retakeText}>Отмена</Text>
              </TouchableOpacity>

            </ScrollView>
          </Animated.View>
        </View>
      </Modal>

      {/* Bottom tabs */}
      <View style={styles.bottomTabs}>
        <TouchableOpacity style={styles.tabBtn} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.tabIcon}>📖</Text>
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Дневник</Text>
          <View style={styles.tabActiveLine} />
        </TouchableOpacity>
        <View style={styles.tabSpacer} />
        <TouchableOpacity style={styles.tabBtn} onPress={() => navigation.navigate('MyTraining', { plan: params.plan })}>
          <Text style={styles.tabIcon}>🏋️</Text>
          <Text style={styles.tabLabel}>Тренировки</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F6FB' },
  bgBlob1: {
    position: 'absolute', width: 320, height: 320, borderRadius: 160,
    backgroundColor: 'rgba(74,123,247,0.07)', top: -80, right: -80,
  },
  bgBlob2: {
    position: 'absolute', width: 240, height: 240, borderRadius: 120,
    backgroundColor: 'rgba(74,247,160,0.06)', bottom: 100, left: -70,
  },

  inner: { flex: 1, paddingHorizontal: 20, paddingTop: 56 },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  greeting: { fontSize: 13, color: '#8E9BB5', fontWeight: '500', marginBottom: 2 },
  dateTitle: { fontSize: 18, fontWeight: '800', color: DARK, textTransform: 'capitalize' },
  avatarBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#EEF3FF', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 20 },

  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  dayPill: {
    width: 40, height: 58, borderRadius: 14, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center', gap: 2,
    shadowColor: DARK, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  dayPillActive: { backgroundColor: BLUE },
  dayText: { fontSize: 10, fontWeight: '600', color: '#8E9BB5' },
  dayTextActive: { color: '#fff' },
  dayNum: { fontSize: 15, fontWeight: '700', color: DARK },
  dayNumActive: { color: '#fff' },
  dayDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.7)' },

  ringCard: {
    backgroundColor: '#fff', borderRadius: 24, padding: 20,
    flexDirection: 'row', justifyContent: 'space-between',
    shadowColor: DARK, shadowOpacity: 0.07, shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 }, elevation: 4, marginBottom: 16,
  },
  ringCardLeft: { flex: 1, justifyContent: 'space-between' },
  ringLabel: { fontSize: 12, color: '#8E9BB5', fontWeight: '500' },
  ringValue: { fontSize: 40, fontWeight: '800', color: DARK, letterSpacing: -1 },
  ringUnit: { fontSize: 13, color: '#8E9BB5', marginTop: -4, marginBottom: 12 },
  macrosCol: { gap: 6 },
  macroRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  macroDot: { width: 8, height: 8, borderRadius: 4 },
  macroLabel: { fontSize: 12, color: '#8E9BB5', flex: 1 },
  macroVal: { fontSize: 12, fontWeight: '700', color: DARK },
  ringWrap: { alignItems: 'center', justifyContent: 'space-between' },
  ringOuter: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 10, borderColor: '#EEF1FA',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  ringInner: { alignItems: 'center' },
  ringPercent: { fontSize: 22, fontWeight: '800', color: DARK },
  ringSubtext: { fontSize: 10, color: '#8E9BB5' },
  ringStats: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ringStat: { alignItems: 'center' },
  ringStatVal: { fontSize: 14, fontWeight: '700', color: DARK },
  ringStatLabel: { fontSize: 10, color: '#8E9BB5' },
  ringStatDiv: { width: 1, height: 24, backgroundColor: '#E4E9F5' },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 12, alignItems: 'center',
    shadowColor: DARK, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  statIcon: { fontSize: 20, marginBottom: 4 },
  statVal: { fontSize: 13, fontWeight: '700', color: DARK },
  statLabel: { fontSize: 11, color: '#8E9BB5', marginTop: 2 },

  mealsCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20,
    shadowColor: DARK, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    marginBottom: 100,
  },
  mealsTitle: { fontSize: 16, fontWeight: '800', color: DARK, marginBottom: 12 },
  mealsEmpty: { textAlign: 'center', color: '#B0BACE', fontSize: 13, paddingVertical: 20 },
  mealItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderColor: '#F0F2F8',
  },
  mealLeft: { flex: 1 },
  mealName: { fontSize: 14, fontWeight: '700', color: DARK, marginBottom: 2 },
  mealMeta: { fontSize: 12, color: '#8E9BB5' },
  mealRight: { alignItems: 'flex-end' },
  mealCal: { fontSize: 14, fontWeight: '800', color: DARK },
  mealMacro: { fontSize: 11, color: '#8E9BB5', marginTop: 2 },

  fabWrap: { position: 'absolute', bottom: 84, alignSelf: 'center' },
  fab: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: BLUE,
    alignItems: 'center', justifyContent: 'center', zIndex: 20,
    shadowColor: BLUE, shadowOpacity: 0.45, shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 }, elevation: 8,
  },
  fabPlus: { color: '#fff', fontSize: 32, lineHeight: 34, fontWeight: '300' },

  bottomTabs: {
    position: 'absolute', left: 0, right: 0, bottom: 0, height: 72,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#EAECF5',
    paddingHorizontal: 32,
  },
  tabBtn: { flex: 1, alignItems: 'center', paddingTop: 8 },
  tabSpacer: { width: 80 },
  tabIcon: { fontSize: 18, marginBottom: 2 },
  tabLabel: { fontSize: 11, fontWeight: '600', color: '#8E9BB5' },
  tabLabelActive: { color: BLUE },
  tabActiveLine: {
    position: 'absolute', top: 0, width: 24, height: 2,
    backgroundColor: BLUE, borderRadius: 2,
  },

  // Analysis Modal
  modalOverlay: { flex: 1, backgroundColor: '#0A0A14' },
  modalImage: { position: 'absolute', top: 0, left: 0, right: 0, height: height * 0.55 },
  modalDark: {
    position: 'absolute', top: 0, left: 0, right: 0, height: height * 0.55,
    backgroundColor: 'rgba(10,10,20,0.4)',
  },
  closeBtn: {
    position: 'absolute', top: 54, left: 20,
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  closeBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  analysisSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    top: height * 0.48,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    paddingHorizontal: 24, paddingTop: 14, paddingBottom: 44,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#E4E9F5', alignSelf: 'center', marginBottom: 20,
  },

  loadingWrap: { alignItems: 'center', paddingVertical: 32, gap: 12 },
  loadingTitle: { fontSize: 16, fontWeight: '700', color: DARK },
  loadingSubtitle: { fontSize: 13, color: '#8E9BB5' },

  errorWrap: { alignItems: 'center', paddingVertical: 24, gap: 10 },
  errorIcon: { fontSize: 40 },
  errorTitle: { fontSize: 18, fontWeight: '800', color: DARK },
  errorText: { fontSize: 13, color: '#8E9BB5', textAlign: 'center', lineHeight: 20 },
  retryBtn: {
    backgroundColor: '#EEF3FF', borderRadius: 12,
    paddingHorizontal: 24, paddingVertical: 12, marginTop: 4,
  },
  retryText: { color: BLUE, fontWeight: '700', fontSize: 14 },

  dishName: { fontSize: 22, fontWeight: '800', color: DARK, marginBottom: 4 },
  dishMeta: { fontSize: 13, color: '#8E9BB5', marginBottom: 20 },
  macroGrid: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  macroCard: { flex: 1, borderRadius: 14, padding: 12, alignItems: 'center' },
  macroCardVal: { fontSize: 16, fontWeight: '800', color: DARK },
  macroCardLabel: { fontSize: 11, color: '#8E9BB5', marginTop: 2 },

  saveBtn: {
    backgroundColor: BLUE, borderRadius: 16, paddingVertical: 17, alignItems: 'center',
    shadowColor: BLUE, shadowOpacity: 0.35, shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 }, elevation: 6, marginBottom: 12,
  },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },

  retakeBtn: { alignItems: 'center', paddingVertical: 10 },
  retakeText: { fontSize: 14, color: '#8E9BB5', fontWeight: '600' },
});