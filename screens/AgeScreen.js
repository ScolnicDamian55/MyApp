import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, StatusBar,
} from 'react-native';

const BLUE = '#4A7BF7';
const DARK = '#1A1A2E';

export default function AgeScreen({ navigation, route }) {
  const [age, setAge] = useState(25);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const animatePop = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.18, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  };

  const change = (delta) => {
    setAge((v) => Math.min(120, Math.max(5, v + delta)));
    animatePop();
  };

  const handleContinue = () => {
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.94, duration: 90, useNativeDriver: true }),
      Animated.timing(btnScale, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      const { gender } = route.params || {};
      navigation.navigate('Body', { gender, age });
    });
  };

  // Arc progress (0–1) mapped from age 5–120
  const progress = (age - 5) / (120 - 5);
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  // Simple SVG-like arc via border trick
  const arcDeg = progress * 280; // sweep 280°

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.stepIndicator}>
          <View style={[styles.dot, styles.dotDone]} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <Text style={styles.stepText}>Шаг 2 из 5</Text>
      </Animated.View>

      <Animated.View style={[styles.titleBlock, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.title}>Сколько{'\n'}вам лет?</Text>
        <Text style={styles.subtitle}>Потребность в калориях зависит от возраста</Text>
      </Animated.View>

      {/* Age dial */}
      <Animated.View style={[styles.dialWrapper, { opacity: fadeAnim }]}>
        {/* Outer ring track */}
        <View style={styles.ringTrack}>
          {/* Progress ring using rotation trick */}
          <View style={[styles.ringProgress, { transform: [{ rotate: `${-140 + arcDeg}deg` }] }]}>
            <View style={styles.ringDot} />
          </View>
          {/* Center content */}
          <View style={styles.dialCenter}>
            <Animated.Text style={[styles.ageNumber, { transform: [{ scale: scaleAnim }] }]}>
              {age}
            </Animated.Text>
            <Text style={styles.ageLabel}>лет</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.ctrlBtn}
            onPress={() => change(-1)}
            activeOpacity={0.8}
          >
            <Text style={styles.ctrlText}>−</Text>
          </TouchableOpacity>

          <View style={styles.ageRange}>
            <Text style={styles.rangeText}>5 — 120</Text>
          </View>

          <TouchableOpacity
            style={[styles.ctrlBtn, styles.ctrlBtnPlus]}
            onPress={() => change(1)}
            activeOpacity={0.8}
          >
            <Text style={[styles.ctrlText, { color: '#fff' }]}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Quick-select chips */}
        <View style={styles.chipsRow}>
          {[18, 25, 35, 45, 60].map((v) => (
            <TouchableOpacity
              key={v}
              style={[styles.chip, age === v && styles.chipActive]}
              onPress={() => { setAge(v); animatePop(); }}
            >
              <Text style={[styles.chipText, age === v && styles.chipTextActive]}>{v}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      <Animated.View style={{ transform: [{ scale: btnScale }], width: '100%' }}>
        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} activeOpacity={0.9}>
          <Text style={styles.continueBtnText}>Продолжить →</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
    overflow: 'hidden',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 44,
  },
  bgCircle1: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(74,123,247,0.08)', top: -80, right: -80,
  },
  bgCircle2: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    backgroundColor: 'rgba(74,200,247,0.07)', bottom: 60, left: -60,
  },

  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  stepIndicator: { flexDirection: 'row', gap: 6, marginRight: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D0D5E8' },
  dotDone: { backgroundColor: '#B0C4F8' },
  dotActive: { backgroundColor: BLUE, width: 24 },
  stepText: { fontSize: 13, color: '#8E9BB5', fontWeight: '500', letterSpacing: 0.3 },

  titleBlock: { marginBottom: 32 },
  title: {
    fontSize: 38, fontWeight: '800', color: DARK,
    lineHeight: 46, letterSpacing: -0.5, marginBottom: 8,
  },
  subtitle: { fontSize: 14, color: '#8E9BB5', lineHeight: 20 },

  /* Dial */
  dialWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 28 },

  ringTrack: {
    width: 220, height: 220, borderRadius: 110,
    borderWidth: 12, borderColor: '#E4E9F5',
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  ringProgress: {
    position: 'absolute',
    width: 220, height: 220, borderRadius: 110,
    borderWidth: 12,
    borderColor: 'transparent',
    borderTopColor: BLUE,
    borderRightColor: BLUE,
    top: -12, left: -12,
  },
  ringDot: {
    position: 'absolute', top: 4, right: 4,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: BLUE,
    shadowColor: BLUE, shadowOpacity: 0.6, shadowRadius: 6, elevation: 4,
  },
  dialCenter: { alignItems: 'center' },
  ageNumber: {
    fontSize: 64, fontWeight: '800', color: DARK, letterSpacing: -2,
  },
  ageLabel: { fontSize: 16, color: '#8E9BB5', fontWeight: '500', marginTop: -4 },

  /* Controls */
  controlsRow: {
    flexDirection: 'row', alignItems: 'center', gap: 20,
  },
  ctrlBtn: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: DARK, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
    borderWidth: 2, borderColor: '#E4E9F5',
  },
  ctrlBtnPlus: {
    backgroundColor: BLUE, borderColor: BLUE,
  },
  ctrlText: { fontSize: 28, fontWeight: '300', color: DARK, lineHeight: 32 },
  ageRange: {
    paddingHorizontal: 16, paddingVertical: 8,
    backgroundColor: '#EEF3FF', borderRadius: 20,
  },
  rangeText: { fontSize: 13, color: BLUE, fontWeight: '600' },

  /* Chips */
  chipsRow: { flexDirection: 'row', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, backgroundColor: '#FFFFFF',
    borderWidth: 1.5, borderColor: '#E4E9F5',
  },
  chipActive: { backgroundColor: BLUE, borderColor: BLUE },
  chipText: { fontSize: 14, fontWeight: '600', color: '#8E9BB5' },
  chipTextActive: { color: '#fff' },

  /* Continue */
  continueBtn: {
    backgroundColor: BLUE, borderRadius: 16,
    paddingVertical: 17, alignItems: 'center',
    shadowColor: BLUE, shadowOpacity: 0.35, shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 }, elevation: 6,
  },
  continueBtnText: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 0.3 },
});