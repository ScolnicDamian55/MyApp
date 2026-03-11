import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Animated, StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BLUE = '#4A7BF7';
const DARK = '#1A1A2E';

// Week color palette cycling
const WEEK_COLORS = [
  { bg: '#EEF3FF', accent: '#4A7BF7', icon: '📅' },
  { bg: '#FFF7ED', accent: '#F7A84A', icon: '🔥' },
  { bg: '#F0FFF8', accent: '#4AF7A0', icon: '💪' },
  { bg: '#FFF0F5', accent: '#F76A9A', icon: '⚡' },
  { bg: '#F5EEFF', accent: '#A44AF7', icon: '🏆' },
  { bg: '#EDFBFF', accent: '#4AC8F7', icon: '🎯' },
];

export default function MyTrainingScreen({ route, navigation }) {
  const routePlan = route?.params?.plan;
  const [plan, setPlan] = useState(routePlan || null);
  const [expanded, setExpanded] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const itemAnims = useRef([]).current;

  useEffect(() => {
    if (routePlan) { setPlan(routePlan); return; }
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('saved_plan');
        if (raw) setPlan(JSON.parse(raw));
      } catch (e) { console.warn(e); }
    })();
  }, [routePlan]);

  useEffect(() => {
    if (!plan) return;
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();

    plan.weeks?.forEach((_, i) => {
      if (!itemAnims[i]) itemAnims[i] = new Animated.Value(0);
      Animated.timing(itemAnims[i], {
        toValue: 1, duration: 400, delay: 200 + i * 70, useNativeDriver: true,
      }).start();
    });
  }, [plan]);

  // Empty state
  if (!plan) {
    return (
      <View style={styles.emptyScreen}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.bgBlob1} />
        <View style={styles.bgBlob2} />
        <Text style={styles.emptyIcon}>🏋️</Text>
        <Text style={styles.emptyTitle}>Нет программы</Text>
        <Text style={styles.emptyText}>У вас пока нет сохранённой программы тренировок.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Назад</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const weeks = plan.weeks || [];

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.bgBlob1} />
      <View style={styles.bgBlob2} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity style={styles.backCircle} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>Программа тренировок</Text>
          </View>

          <Text style={styles.planTitle}>{plan.title}</Text>
          <Text style={styles.planSummary}>{plan.summary}</Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <Text style={styles.statIcon}>📆</Text>
              <Text style={styles.statText}>{weeks.length} недель</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statIcon}>⏱️</Text>
              <Text style={styles.statText}>~45 мин/день</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statIcon}>📈</Text>
              <Text style={styles.statText}>Прогрессия</Text>
            </View>
          </View>
        </Animated.View>

        {/* Week cards */}
        <View style={styles.weeksSection}>
          <Text style={styles.sectionTitle}>Расписание</Text>

          {weeks.map((item, idx) => {
            const color = WEEK_COLORS[idx % WEEK_COLORS.length];
            const isOpen = expanded === idx;
            const anim = itemAnims[idx] || new Animated.Value(1);

            return (
              <Animated.View
                key={idx}
                style={{
                  opacity: anim,
                  transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
                }}
              >
                <TouchableOpacity
                  style={[styles.weekCard, isOpen && { borderColor: color.accent, borderWidth: 2 }]}
                  onPress={() => setExpanded(isOpen ? null : idx)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.weekLeft, { backgroundColor: color.bg }]}>
                    <Text style={styles.weekIcon}>{color.icon}</Text>
                    <Text style={[styles.weekNum, { color: color.accent }]}>{idx + 1}</Text>
                  </View>

                  <View style={styles.weekContent}>
                    <Text style={styles.weekLabel}>Неделя {idx + 1}</Text>
                    <Text style={styles.weekPreview} numberOfLines={isOpen ? 0 : 2}>
                      {item}
                    </Text>
                  </View>

                  <Text style={[styles.chevron, { color: color.accent }]}>
                    {isOpen ? '▲' : '▼'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Bottom CTA */}
        <Animated.View style={{ opacity: fadeAnim, paddingBottom: 32 }}>
          <TouchableOpacity style={styles.startBtn} activeOpacity={0.9}>
            <Text style={styles.startBtnText}>🚀 Начать программу</Text>
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
    backgroundColor: 'rgba(74,123,247,0.07)', top: -60, right: -80,
  },
  bgBlob2: {
    position: 'absolute', width: 240, height: 240, borderRadius: 120,
    backgroundColor: 'rgba(164,74,247,0.06)', bottom: 80, left: -60,
  },

  scroll: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20 },

  /* Header */
  header: { marginBottom: 32 },
  backCircle: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: DARK, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
    marginBottom: 20, alignSelf: 'flex-start',
  },
  backArrow: { fontSize: 18, color: DARK, marginBottom: 7 },

  headerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF3FF', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5, marginBottom: 10,
  },
  headerBadgeText: { fontSize: 12, color: BLUE, fontWeight: '700', letterSpacing: 0.3 },

  planTitle: {
    fontSize: 34, fontWeight: '800', color: DARK,
    lineHeight: 40, letterSpacing: -0.5, marginBottom: 8,
  },
  planSummary: { fontSize: 14, color: '#8E9BB5', lineHeight: 20, marginBottom: 20 },

  statsRow: { flexDirection: 'row', gap: 8 },
  statPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#fff', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 7,
    shadowColor: DARK, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  statIcon: { fontSize: 13 },
  statText: { fontSize: 12, fontWeight: '600', color: DARK },

  /* Weeks */
  weeksSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: DARK, marginBottom: 14 },

  weekCard: {
    backgroundColor: '#fff', borderRadius: 18,
    flexDirection: 'row', alignItems: 'flex-start',
    marginBottom: 10, overflow: 'hidden',
    borderWidth: 2, borderColor: 'transparent',
    shadowColor: DARK, shadowOpacity: 0.06,
    shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  weekLeft: {
    width: 60, paddingVertical: 18,
    alignItems: 'center', justifyContent: 'center', gap: 4,
  },
  weekIcon: { fontSize: 18 },
  weekNum: { fontSize: 15, fontWeight: '800' },

  weekContent: { flex: 1, padding: 14 },
  weekLabel: { fontSize: 12, fontWeight: '700', color: '#8E9BB5', marginBottom: 4, letterSpacing: 0.3 },
  weekPreview: { fontSize: 14, color: DARK, lineHeight: 20 },

  chevron: { fontSize: 11, paddingTop: 18, paddingRight: 14 },

  /* CTA */
  startBtn: {
    backgroundColor: BLUE, borderRadius: 16,
    paddingVertical: 17, alignItems: 'center',
    shadowColor: BLUE, shadowOpacity: 0.35, shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 }, elevation: 6,
  },
  startBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },

  /* Empty */
  emptyScreen: {
    flex: 1, backgroundColor: '#F4F6FB',
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 40, overflow: 'hidden',
  },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 24, fontWeight: '800', color: DARK, marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#8E9BB5', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  backBtn: {
    backgroundColor: BLUE, borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 36,
    shadowColor: BLUE, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
  },
  backBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});