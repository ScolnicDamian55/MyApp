import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, StatusBar, ScrollView,
} from 'react-native';

const BLUE = '#4A7BF7';
const DARK = '#1A1A2E';

function getActivityMultiplier(activity) {
  const map = {
    'Малоподвижный': 1.2, 'Легкий': 1.375,
    'Средний': 1.55, 'Активный': 1.725, 'Очень Активный': 1.9,
  };
  return map[activity] || 1.2;
}

function calculateBMR(gender, weight, height, age) {
  if (!weight || !height || !age) return null;
  return gender === 'Мужской'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
}

const monthWord = (n) => {
  if (n % 10 === 1 && n % 100 !== 11) return 'месяц';
  if ([2,3,4].includes(n % 10) && ![12,13,14].includes(n % 100)) return 'месяца';
  return 'месяцев';
};

export default function PlanScreen({ route, navigation }) {
  const { gender, age, height, currentWeight, desiredWeight, activity } = route.params || {};
  const ageNum = Number(age) || 0;
  const heightNum = Number(height) || 0;
  const currentWeightNum = Number(currentWeight) || 0;
  const desiredWeightNum = Number(desiredWeight) || 0;

  const BMR = calculateBMR(gender, currentWeightNum, heightNum, ageNum);
  const multiplier = getActivityMultiplier(activity);
  const maintenance = BMR ? Math.round(BMR * multiplier) : null;

  const diffKg = Math.abs(desiredWeightNum - currentWeightNum);
  const dailyDelta = 500;
  const requiredDays = diffKg === 0 ? 0 : Math.ceil((diffKg * 7700) / dailyDelta);
  const months = requiredDays === 0 ? 0 : Math.max(1, Math.ceil(requiredDays / 30));

  let goal = 'Поддержание веса';
  let goalIcon = '⚖️';
  let goalColor = '#4AC8F7';
  if (desiredWeightNum < currentWeightNum) { goal = 'Похудение'; goalIcon = '🔥'; goalColor = '#F76A6A'; }
  else if (desiredWeightNum > currentWeightNum) { goal = 'Набор веса'; goalIcon = '💪'; goalColor = '#4AF7A0'; }

  let targetCalories = maintenance;
  if (maintenance && diffKg > 0) {
    targetCalories = desiredWeightNum < currentWeightNum
      ? Math.max(1200, Math.round(maintenance - dailyDelta))
      : Math.round(maintenance + dailyDelta);
  }

  const termText = diffKg === 0 ? '—' : `${months} ${monthWord(months)}`;

  // Macros estimate
  const protein = targetCalories ? Math.round((targetCalories * 0.30) / 4) : 0;
  const carbs   = targetCalories ? Math.round((targetCalories * 0.45) / 4) : 0;
  const fat     = targetCalories ? Math.round((targetCalories * 0.25) / 9) : 0;

  // Animations
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleCard = useRef(new Animated.Value(0.92)).current;
  const btnScale  = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 550, useNativeDriver: true }),
      Animated.spring(scaleCard, { toValue: 1, friction: 6, delay: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleContinue = () => {
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.94, duration: 90, useNativeDriver: true }),
      Animated.timing(btnScale, { toValue: 1,    duration: 150, useNativeDriver: true }),
    ]).start(() => navigation.navigate('TrainingAsk', {
      gender, age: ageNum, height: heightNum,
      currentWeight: currentWeightNum, desiredWeight: desiredWeightNum,
      activity, targetCalories, goal, termText,
    }));
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.bgBlob1} />
      <View style={styles.bgBlob2} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✅ План готов</Text>
          </View>
          <Text style={styles.title}>Ваш персональный{'\n'}план здоровья</Text>
          <Text style={styles.subtitle}>На основе ваших данных мы рассчитали оптимальный рацион</Text>
        </Animated.View>

        {/* Hero calorie card */}
        <Animated.View style={[styles.heroCard, { transform: [{ scale: scaleCard }], opacity: fadeAnim }]}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>Суточная норма</Text>
              <Text style={styles.heroCalories}>{targetCalories ?? '—'}</Text>
              <Text style={styles.heroUnit}>ккал / день</Text>
            </View>
            <View style={[styles.goalBadge, { backgroundColor: goalColor + '22', borderColor: goalColor }]}>
              <Text style={styles.goalIcon}>{goalIcon}</Text>
              <Text style={[styles.goalText, { color: goalColor }]}>{goal}</Text>
            </View>
          </View>

          {/* Macro bars */}
          <View style={styles.macroSection}>
            {[
              { label: 'Белки',    val: protein, unit: 'г', pct: 30, color: BLUE },
              { label: 'Углеводы', val: carbs,   unit: 'г', pct: 45, color: '#F7A84A' },
              { label: 'Жиры',     val: fat,     unit: 'г', pct: 25, color: '#F76A6A' },
            ].map((m) => (
              <View key={m.label} style={styles.macroRow}>
                <Text style={styles.macroLabel}>{m.label}</Text>
                <View style={styles.macroBarTrack}>
                  <View style={[styles.macroBarFill, { width: `${m.pct}%`, backgroundColor: m.color }]} />
                </View>
                <Text style={styles.macroVal}>{m.val}{m.unit}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Stat cards row */}
        <Animated.View style={[styles.statsRow, { opacity: fadeAnim }]}>
          {[
            { icon: '⏳', label: 'Срок',         val: termText },
            { icon: '🔥', label: 'Поддержание',  val: maintenance ? `${maintenance} ккал` : '—' },
            { icon: '📉', label: 'Дефицит/день', val: diffKg > 0 ? `${dailyDelta} ккал` : '—' },
          ].map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={styles.statVal}>{s.val}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Info cards */}
        <Animated.View style={[styles.infoSection, { opacity: fadeAnim }]}>
          {[
            { icon: '💡', title: 'Как это работает', text: `Ежедневный ${desiredWeightNum < currentWeightNum ? 'дефицит' : 'профицит'} в ${dailyDelta} ккал обеспечит плавное и безопасное изменение веса.` },
            { icon: '📊', title: 'Ваши параметры', text: `${gender} · ${ageNum} лет · ${heightNum} см · ${currentWeightNum} кг → ${desiredWeightNum} кг` },
          ].map((c) => (
            <View key={c.title} style={styles.infoCard}>
              <Text style={styles.infoIcon}>{c.icon}</Text>
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>{c.title}</Text>
                <Text style={styles.infoBody}>{c.text}</Text>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* CTA */}
        <Animated.View style={{ transform: [{ scale: btnScale }], paddingBottom: 40 }}>
          <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} activeOpacity={0.9}>
            <Text style={styles.continueBtnText}>Получить программу тренировок →</Text>
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
    backgroundColor: 'rgba(74,123,247,0.08)', top: -60, right: -80,
  },
  bgBlob2: {
    position: 'absolute', width: 260, height: 260, borderRadius: 130,
    backgroundColor: 'rgba(74,247,160,0.07)', bottom: 60, left: -70,
  },

  scroll: { paddingHorizontal: 20, paddingTop: 64, paddingBottom: 10 },

  /* Header */
  header: { marginBottom: 24 },
  badge: {
    alignSelf: 'flex-start', backgroundColor: '#EDFFF6',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 12,
  },
  badgeText: { fontSize: 12, color: '#27ae60', fontWeight: '700' },
  title: {
    fontSize: 34, fontWeight: '800', color: DARK,
    lineHeight: 42, letterSpacing: -0.5, marginBottom: 8,
  },
  subtitle: { fontSize: 14, color: '#8E9BB5', lineHeight: 20 },

  /* Hero card */
  heroCard: {
    backgroundColor: '#fff', borderRadius: 24, padding: 22,
    shadowColor: DARK, shadowOpacity: 0.08, shadowRadius: 16,
    shadowOffset: { width: 0, height: 5 }, elevation: 5, marginBottom: 14,
  },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  heroLabel: { fontSize: 12, color: '#8E9BB5', fontWeight: '500', marginBottom: 4 },
  heroCalories: { fontSize: 52, fontWeight: '800', color: DARK, letterSpacing: -2 },
  heroUnit: { fontSize: 14, color: '#8E9BB5', marginTop: -4 },

  goalBadge: {
    borderRadius: 16, borderWidth: 1.5,
    paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center', gap: 4,
  },
  goalIcon: { fontSize: 20 },
  goalText: { fontSize: 12, fontWeight: '700' },

  macroSection: { gap: 10 },
  macroRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  macroLabel: { fontSize: 12, color: '#8E9BB5', width: 72, fontWeight: '500' },
  macroBarTrack: { flex: 1, height: 6, borderRadius: 3, backgroundColor: '#EEF1FA' },
  macroBarFill: { height: '100%', borderRadius: 3 },
  macroVal: { fontSize: 12, fontWeight: '700', color: DARK, width: 40, textAlign: 'right' },

  /* Stats row */
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 14, alignItems: 'center',
    shadowColor: DARK, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  statIcon: { fontSize: 20, marginBottom: 6 },
  statVal: { fontSize: 13, fontWeight: '800', color: DARK, textAlign: 'center', marginBottom: 2 },
  statLabel: { fontSize: 10, color: '#8E9BB5', textAlign: 'center' },

  /* Info cards */
  infoSection: { gap: 10, marginBottom: 24 },
  infoCard: {
    backgroundColor: '#fff', borderRadius: 18, padding: 16,
    flexDirection: 'row', gap: 14, alignItems: 'flex-start',
    shadowColor: DARK, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  infoIcon: { fontSize: 24, marginTop: 2 },
  infoText: { flex: 1 },
  infoTitle: { fontSize: 14, fontWeight: '700', color: DARK, marginBottom: 4 },
  infoBody: { fontSize: 13, color: '#8E9BB5', lineHeight: 19 },

  /* CTA */
  continueBtn: {
    backgroundColor: BLUE, borderRadius: 16, paddingVertical: 17, alignItems: 'center',
    shadowColor: BLUE, shadowOpacity: 0.35, shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 }, elevation: 6,
  },
  continueBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
});