import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, StatusBar,
} from 'react-native';

const BLUE = '#4A7BF7';
const DARK = '#1A1A2E';

export default function WeightScreen({ navigation, route }) {
  const { gender, age, height, currentWeight } = route.params || {};
  const [weight, setWeight] = useState(currentWeight ? Math.max(20, currentWeight - 5) : 65);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const btnScale  = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const animatePop = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.18, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4,    useNativeDriver: true }),
    ]).start();
  };

  const change = (delta) => {
    setWeight((v) => Math.min(300, Math.max(20, v + delta)));
    animatePop();
  };

  const handleContinue = () => {
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.94, duration: 90,  useNativeDriver: true }),
      Animated.timing(btnScale, { toValue: 1,    duration: 150, useNativeDriver: true }),
    ]).start(() => {
      navigation.navigate('Activity', { gender, age, height, currentWeight, desiredWeight: weight });
    });
  };

  // Diff vs current weight
  const diff = currentWeight ? weight - currentWeight : 0;
  const diffAbs = Math.abs(diff);
  const diffLabel = diff === 0 ? 'Поддержание веса' : diff < 0 ? `−${diffAbs} кг · Похудение` : `+${diffAbs} кг · Набор массы`;
  const diffColor = diff === 0 ? '#4AC8F7' : diff < 0 ? '#F76A6A' : '#4AF7A0';

  // Progress bar: 20–300
  const progress = (weight - 20) / (300 - 20);

  // Quick-pick chips relative to current
  const chips = currentWeight
    ? [currentWeight - 10, currentWeight - 5, currentWeight, currentWeight + 5, currentWeight + 10]
        .filter((v) => v >= 20 && v <= 300)
    : [55, 60, 65, 70, 80];

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.bgBlob1} />
      <View style={styles.bgBlob2} />

      <Animated.View style={[styles.inner, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

        {/* Step indicator */}
        <View style={styles.header}>
          <View style={styles.stepIndicator}>
            {[0,1,2,3].map((i) => (
              <View key={i} style={[styles.dot, i < 4 && styles.dotDone, i === 3 && styles.dotActive]} />
            ))}
            <View style={styles.dot} />
          </View>
          <Text style={styles.stepText}>Шаг 4 из 5</Text>
        </View>

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Желаемый{'\n'}вес</Text>
          <Text style={styles.subtitle}>
            {currentWeight ? `Текущий вес: ${currentWeight} кг` : 'Введите вес в килограммах'}
          </Text>
        </View>

        {/* Value card */}
        <View style={styles.card}>
          <View style={styles.controlRow}>
            <TouchableOpacity style={styles.ctrlBtn} onPress={() => change(-1)} activeOpacity={0.8}>
              <Text style={styles.ctrlText}>−</Text>
            </TouchableOpacity>

            <View style={styles.valueWrap}>
              <Animated.Text style={[styles.valueNum, { transform: [{ scale: scaleAnim }] }]}>
                {weight}
              </Animated.Text>
              <Text style={styles.valueUnit}>кг</Text>
            </View>

            <TouchableOpacity style={[styles.ctrlBtn, styles.ctrlBtnFilled]} onPress={() => change(1)} activeOpacity={0.8}>
              <Text style={[styles.ctrlText, { color: '#fff' }]}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Progress bar */}
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
          </View>
          <View style={styles.barLabels}>
            <Text style={styles.barLabel}>20 кг</Text>
            <Text style={styles.barLabel}>300 кг</Text>
          </View>

          {/* Diff badge */}
          <View style={[styles.diffBadge, { backgroundColor: diffColor + '22', borderColor: diffColor }]}>
            <Text style={[styles.diffText, { color: diffColor }]}>{diffLabel}</Text>
          </View>
        </View>

        {/* Quick chips */}
        <View style={styles.chipsSection}>
          <Text style={styles.chipsLabel}>Быстрый выбор</Text>
          <View style={styles.chipsRow}>
            {chips.map((v) => (
              <TouchableOpacity
                key={v}
                style={[styles.chip, weight === v && styles.chipActive]}
                onPress={() => { setWeight(v); animatePop(); }}
              >
                <Text style={[styles.chipText, weight === v && styles.chipTextActive]}>
                  {v} кг
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </Animated.View>

      {/* Continue */}
      <Animated.View style={[styles.btnWrap, { transform: [{ scale: btnScale }] }]}>
        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} activeOpacity={0.9}>
          <Text style={styles.continueBtnText}>Продолжить →</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1, backgroundColor: '#F4F6FB',
    overflow: 'hidden', paddingHorizontal: 24,
    paddingTop: 60, paddingBottom: 44,
  },
  bgBlob1: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(74,123,247,0.08)', top: -80, right: -80,
  },
  bgBlob2: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    backgroundColor: 'rgba(247,106,154,0.07)', bottom: 60, left: -60,
  },

  inner: { flex: 1 },

  /* Header */
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  stepIndicator: { flexDirection: 'row', gap: 6, marginRight: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D0D5E8' },
  dotDone: { backgroundColor: '#B0C4F8' },
  dotActive: { backgroundColor: BLUE, width: 24 },
  stepText: { fontSize: 13, color: '#8E9BB5', fontWeight: '500', letterSpacing: 0.3 },

  /* Title */
  titleBlock: { marginBottom: 28 },
  title: {
    fontSize: 38, fontWeight: '800', color: DARK,
    lineHeight: 46, letterSpacing: -0.5, marginBottom: 8,
  },
  subtitle: { fontSize: 14, color: '#8E9BB5', lineHeight: 20 },

  /* Card */
  card: {
    backgroundColor: '#fff', borderRadius: 24, padding: 24,
    shadowColor: DARK, shadowOpacity: 0.07, shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 }, elevation: 4,
    marginBottom: 20,
  },
  controlRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 20,
  },
  ctrlBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#E4E9F5',
    shadowColor: DARK, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  ctrlBtnFilled: { backgroundColor: BLUE, borderColor: BLUE },
  ctrlText: { fontSize: 26, fontWeight: '300', color: DARK, lineHeight: 30 },

  valueWrap: { alignItems: 'center' },
  valueNum: { fontSize: 64, fontWeight: '800', color: DARK, letterSpacing: -2 },
  valueUnit: { fontSize: 16, color: '#8E9BB5', fontWeight: '500', marginTop: -8 },

  barTrack: {
    height: 6, borderRadius: 3,
    backgroundColor: '#EEF1FA', overflow: 'hidden', marginBottom: 4,
  },
  barFill: { height: '100%', borderRadius: 3, backgroundColor: BLUE },
  barLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  barLabel: { fontSize: 11, color: '#B0BACE' },

  diffBadge: {
    alignSelf: 'center', borderRadius: 24, borderWidth: 1.5,
    paddingHorizontal: 18, paddingVertical: 8,
  },
  diffText: { fontSize: 13, fontWeight: '700', letterSpacing: 0.2 },

  /* Chips */
  chipsSection: { gap: 10 },
  chipsLabel: { fontSize: 13, color: '#8E9BB5', fontWeight: '600' },
  chipsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, backgroundColor: '#fff',
    borderWidth: 1.5, borderColor: '#E4E9F5',
  },
  chipActive: { backgroundColor: BLUE, borderColor: BLUE },
  chipText: { fontSize: 13, fontWeight: '600', color: '#8E9BB5' },
  chipTextActive: { color: '#fff' },

  /* Continue */
  btnWrap: { paddingTop: 8 },
  continueBtn: {
    backgroundColor: BLUE, borderRadius: 16,
    paddingVertical: 17, alignItems: 'center',
    shadowColor: BLUE, shadowOpacity: 0.35, shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 }, elevation: 6,
  },
  continueBtnText: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 0.3 },
});