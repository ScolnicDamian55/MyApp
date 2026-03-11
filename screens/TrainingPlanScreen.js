import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Animated, StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BLUE = '#4A7BF7';
const DARK = '#1A1A2E';

const DAY_COLORS = [
  { bg: '#EEF3FF', accent: BLUE,      icon: '🏃' },
  { bg: '#FFF7ED', accent: '#F7A84A', icon: '💪' },
  { bg: '#F0FFF8', accent: '#4AF7A0', icon: '🧘' },
  { bg: '#FFF0F5', accent: '#F76A9A', icon: '🦵' },
  { bg: '#F5EEFF', accent: '#A44AF7', icon: '⚡' },
  { bg: '#EDFBFF', accent: '#4AC8F7', icon: '🚴' },
  { bg: '#FFF8ED', accent: '#F7C94A', icon: '😴' },
];

function getPlanForGoal(goal) {
  switch (goal) {
    case 'Похудение':
      return {
        title: 'Программа\nдля похудения',
        summary: 'Кардио + силовые тренировки 4–5 раз в неделю для максимального жиросжигания.',
        weeks: [
          'Пн: 30–45 мин кардио (бег / велосипед)',
          'Вт: Силовая — верхняя часть тела (45 мин)',
          'Ср: Восстановление — прогулка 30 мин',
          'Чт: Силовая — нижняя часть тела (45 мин)',
          'Пт: Интервалы HIIT 20–30 мин',
          'Сб: Лёгкое кардио или йога',
          'Вс: Полный отдых',
        ],
        goalIcon: '🔥',
        goalColor: '#F76A6A',
      };
    case 'Набор веса':
      return {
        title: 'Программа\nдля набора массы',
        summary: 'Силовые тренировки 4 раза в неделю с прогрессивной перегрузкой.',
        weeks: [
          'Пн: Силовая — спина / бицепс (60 мин)',
          'Вт: Силовая — грудь / трицепс (60 мин)',
          'Ср: Отдых или лёгкая активность',
          'Чт: Силовая — ноги (60–75 мин)',
          'Пт: Силовая — плечи / кор (60 мин)',
          'Сб: Комплексы + кардио малого объёма',
          'Вс: Полный отдых',
        ],
        goalIcon: '💪',
        goalColor: '#4AF7A0',
      };
    default:
      return {
        title: 'Программа\nподдержания формы',
        summary: 'Сбалансированная программа 3 раза в неделю: силовые + кардио.',
        weeks: [
          'Пн: Силовая общая (45–60 мин)',
          'Ср: Кардио средней интенсивности (30–45 мин)',
          'Пт: Силовая общая (45–60 мин)',
          'Выходные: прогулки / восстановление',
        ],
        goalIcon: '⚖️',
        goalColor: '#4AC8F7',
      };
  }
}

export default function TrainingPlanScreen({ route, navigation }) {
  const { goal, targetCalories, termText } = route.params || {};
  const base = getPlanForGoal(goal);
  const plan = { ...base, targetCalories, termText };

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const itemAnims = useRef(plan.weeks.map(() => new Animated.Value(0))).current;
  const btnScale  = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
    plan.weeks.forEach((_, i) => {
      Animated.timing(itemAnims[i], {
        toValue: 1, duration: 400, delay: 250 + i * 70, useNativeDriver: true,
      }).start();
    });
  }, []);

  const handleDone = async () => {
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.94, duration: 90,  useNativeDriver: true }),
      Animated.timing(btnScale, { toValue: 1,    duration: 150, useNativeDriver: true }),
    ]).start(async () => {
      try { await AsyncStorage.setItem('saved_plan', JSON.stringify(plan)); }
      catch (e) { console.warn(e); }
      navigation.navigate('PhotoTrack', { plan });
    });
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.bgBlob1} />
      <View style={styles.bgBlob2} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={[styles.badge, { backgroundColor: base.goalColor + '22' }]}>
            <Text style={styles.badgeText}>
              {base.goalIcon} {goal || 'Поддержание'}
            </Text>
          </View>
          <Text style={styles.title}>{plan.title}</Text>
          <Text style={styles.summary}>{plan.summary}</Text>

          {/* Stats pills */}
          <View style={styles.pillsRow}>
            <View style={styles.pill}>
              <Text style={styles.pillIcon}>📅</Text>
              <Text style={styles.pillText}>{plan.weeks.length} дней/нед.</Text>
            </View>
            {termText && termText !== '—' && (
              <View style={styles.pill}>
                <Text style={styles.pillIcon}>⏳</Text>
                <Text style={styles.pillText}>{termText}</Text>
              </View>
            )}
            {targetCalories && (
              <View style={styles.pill}>
                <Text style={styles.pillIcon}>🔥</Text>
                <Text style={styles.pillText}>{targetCalories} ккал</Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Section label */}
        <Animated.Text style={[styles.sectionTitle, { opacity: fadeAnim }]}>
          Расписание недели
        </Animated.Text>

        {/* Day cards */}
        {plan.weeks.map((item, idx) => {
          const c = DAY_COLORS[idx % DAY_COLORS.length];
          const anim = itemAnims[idx];
          return (
            <Animated.View
              key={idx}
              style={{
                opacity: anim,
                transform: [{ translateY: anim.interpolate({ inputRange: [0,1], outputRange: [20,0] }) }],
              }}
            >
              <View style={styles.dayCard}>
                <View style={[styles.dayLeft, { backgroundColor: c.bg }]}>
                  <Text style={styles.dayEmoji}>{c.icon}</Text>
                  <Text style={[styles.dayNum, { color: c.accent }]}>{idx + 1}</Text>
                </View>
                <View style={styles.dayContent}>
                  <View style={[styles.accentBar, { backgroundColor: c.accent }]} />
                  <Text style={styles.dayText}>{item}</Text>
                </View>
              </View>
            </Animated.View>
          );
        })}

        {/* CTA */}
        <Animated.View style={[{ transform: [{ scale: btnScale }] }, styles.btnWrap]}>
          <TouchableOpacity style={styles.doneBtn} onPress={handleDone} activeOpacity={0.9}>
            <Text style={styles.doneBtnText}>Сохранить и начать 🚀</Text>
          </TouchableOpacity>
          <Text style={styles.saveTip}>План сохранится в разделе «Тренировки»</Text>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F6FB' },

  bgBlob1: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(74,123,247,0.08)', top: -60, right: -80,
  },
  bgBlob2: {
    position: 'absolute', width: 260, height: 260, borderRadius: 130,
    backgroundColor: 'rgba(164,74,247,0.06)', bottom: 60, left: -70,
  },

  scroll: { paddingHorizontal: 20, paddingTop: 64, paddingBottom: 32 },

  /* Header */
  header: { marginBottom: 24 },
  badge: {
    alignSelf: 'flex-start', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5, marginBottom: 12,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: DARK, letterSpacing: 0.3 },
  title: {
    fontSize: 34, fontWeight: '800', color: DARK,
    lineHeight: 42, letterSpacing: -0.5, marginBottom: 8,
  },
  summary: { fontSize: 14, color: '#8E9BB5', lineHeight: 21, marginBottom: 18 },

  pillsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#fff', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 7,
    shadowColor: DARK, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  pillIcon: { fontSize: 13 },
  pillText: { fontSize: 12, fontWeight: '600', color: DARK },

  sectionTitle: {
    fontSize: 18, fontWeight: '800', color: DARK, marginBottom: 14,
  },

  /* Day cards */
  dayCard: {
    backgroundColor: '#fff', borderRadius: 18,
    flexDirection: 'row', alignItems: 'stretch',
    marginBottom: 10, overflow: 'hidden',
    shadowColor: DARK, shadowOpacity: 0.06,
    shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  dayLeft: {
    width: 58, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, gap: 4,
  },
  dayEmoji: { fontSize: 18 },
  dayNum: { fontSize: 13, fontWeight: '800' },

  dayContent: {
    flex: 1, flexDirection: 'row',
    alignItems: 'center', paddingVertical: 16, paddingRight: 16,
  },
  accentBar: {
    width: 3, height: '70%', borderRadius: 2, marginRight: 12,
  },
  dayText: { flex: 1, fontSize: 14, color: DARK, lineHeight: 20, fontWeight: '500' },

  /* CTA */
  btnWrap: { marginTop: 8 },
  doneBtn: {
    backgroundColor: BLUE, borderRadius: 16,
    paddingVertical: 17, alignItems: 'center',
    shadowColor: BLUE, shadowOpacity: 0.35, shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 }, elevation: 6,
    marginBottom: 10,
  },
  doneBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
  saveTip: { textAlign: 'center', fontSize: 12, color: '#B0BACE' },
});