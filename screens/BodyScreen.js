import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, StatusBar, ScrollView,
} from 'react-native';

const BLUE = '#4A7BF7';
const DARK = '#1A1A2E';

export default function BodyScreen({ navigation, route }) {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const heightScale = useRef(new Animated.Value(1)).current;
  const weightScale = useRef(new Animated.Value(1)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const animatePop = (ref) => {
    Animated.sequence([
      Animated.timing(ref, { toValue: 1.18, duration: 100, useNativeDriver: true }),
      Animated.spring(ref, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  };

  const changeHeight = (d) => { setHeight((v) => Math.min(250, Math.max(50, v + d))); animatePop(heightScale); };
  const changeWeight = (d) => { setWeight((v) => Math.min(300, Math.max(20, v + d))); animatePop(weightScale); };

  const handleContinue = () => {
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.94, duration: 90, useNativeDriver: true }),
      Animated.timing(btnScale, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      const { gender, age } = route.params || {};
      navigation.navigate('Weight', { gender, age, height, currentWeight: weight });
    });
  };

  const bmi = weight / ((height / 100) ** 2);
  const bmiLabel = bmi < 18.5 ? 'Недовес' : bmi < 25 ? 'Норма' : bmi < 30 ? 'Избыток' : 'Ожирение';
  const bmiColor = bmi < 18.5 ? '#4AC8F7' : bmi < 25 ? '#4AF7A0' : bmi < 30 ? '#F7A84A' : '#F76A6A';
  const heightProgress = (height - 50) / (250 - 50);
  const weightProgress = (weight - 20) / (300 - 20);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {/* Fixed header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.stepIndicator}>
          {[0,1,2,3,4].map((i) => (
            <View key={i} style={[styles.dot, i < 2 && styles.dotDone, i === 2 && styles.dotActive]} />
          ))}
        </View>
        <Text style={styles.stepText}>Шаг 3 из 5</Text>
      </Animated.View>

      {/* Scrollable content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.titleBlock, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>Рост{'\n'}и вес</Text>
          <Text style={styles.subtitle}>Используется для расчёта индекса массы тела</Text>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Height card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>📏</Text>
              <Text style={styles.cardTitle}>Рост</Text>
              <Text style={styles.cardUnit}>см</Text>
            </View>
            <View style={styles.controlRow}>
              <TouchableOpacity style={styles.ctrlBtn} onPress={() => changeHeight(-1)} activeOpacity={0.8}>
                <Text style={styles.ctrlText}>−</Text>
              </TouchableOpacity>
              <Animated.Text style={[styles.valueText, { transform: [{ scale: heightScale }] }]}>
                {height}
              </Animated.Text>
              <TouchableOpacity style={[styles.ctrlBtn, styles.ctrlBtnFilled]} onPress={() => changeHeight(1)} activeOpacity={0.8}>
                <Text style={[styles.ctrlText, { color: '#fff' }]}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${heightProgress * 100}%`, backgroundColor: BLUE }]} />
            </View>
            <View style={styles.barLabels}>
              <Text style={styles.barLabel}>50</Text>
              <Text style={styles.barLabel}>250</Text>
            </View>
          </View>

          {/* Weight card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>⚖️</Text>
              <Text style={styles.cardTitle}>Вес</Text>
              <Text style={styles.cardUnit}>кг</Text>
            </View>
            <View style={styles.controlRow}>
              <TouchableOpacity style={styles.ctrlBtn} onPress={() => changeWeight(-1)} activeOpacity={0.8}>
                <Text style={styles.ctrlText}>−</Text>
              </TouchableOpacity>
              <Animated.Text style={[styles.valueText, { transform: [{ scale: weightScale }] }]}>
                {weight}
              </Animated.Text>
              <TouchableOpacity style={[styles.ctrlBtn, styles.ctrlBtnFilled]} onPress={() => changeWeight(1)} activeOpacity={0.8}>
                <Text style={[styles.ctrlText, { color: '#fff' }]}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${weightProgress * 100}%`, backgroundColor: '#F7A84A' }]} />
            </View>
            <View style={styles.barLabels}>
              <Text style={styles.barLabel}>20</Text>
              <Text style={styles.barLabel}>300</Text>
            </View>
          </View>

          {/* BMI pill */}
          <View style={[styles.bmiPill, { backgroundColor: bmiColor + '22', borderColor: bmiColor }]}>
            <Text style={[styles.bmiText, { color: bmiColor }]}>
              ИМТ {bmi.toFixed(1)} · {bmiLabel}
            </Text>
          </View>
        </Animated.View>

        {/* Continue button inside scroll */}
        <Animated.View style={[styles.btnWrap, { transform: [{ scale: btnScale }] }]}>
          <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} activeOpacity={0.9}>
            <Text style={styles.continueBtnText}>Продолжить →</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F6FB', overflow: 'hidden' },

  bgCircle1: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(74,123,247,0.08)', top: -80, right: -80,
  },
  bgCircle2: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    backgroundColor: 'rgba(74,247,160,0.07)', bottom: 60, left: -60,
  },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 60, paddingBottom: 8,
  },
  stepIndicator: { flexDirection: 'row', gap: 6, marginRight: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D0D5E8' },
  dotDone: { backgroundColor: '#B0C4F8' },
  dotActive: { backgroundColor: BLUE, width: 24 },
  stepText: { fontSize: 13, color: '#8E9BB5', fontWeight: '500', letterSpacing: 0.3 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },

  titleBlock: { marginBottom: 20, marginTop: 8 },
  title: {
    fontSize: 38, fontWeight: '800', color: DARK,
    lineHeight: 46, letterSpacing: -0.5, marginBottom: 8,
  },
  subtitle: { fontSize: 14, color: '#8E9BB5', lineHeight: 20 },

  card: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20,
    shadowColor: DARK, shadowOpacity: 0.07, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 3, marginBottom: 14,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  cardIcon: { fontSize: 20 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: DARK, flex: 1 },
  cardUnit: { fontSize: 13, color: '#8E9BB5', fontWeight: '500' },

  controlRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 16,
  },
  ctrlBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#E4E9F5',
    shadowColor: DARK, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  ctrlBtnFilled: { backgroundColor: BLUE, borderColor: BLUE },
  ctrlText: { fontSize: 26, fontWeight: '300', color: DARK, lineHeight: 30 },
  valueText: { fontSize: 52, fontWeight: '800', color: DARK, letterSpacing: -1 },

  barTrack: { height: 6, borderRadius: 3, backgroundColor: '#EEF1FA', overflow: 'hidden', marginBottom: 4 },
  barFill: { height: '100%', borderRadius: 3 },
  barLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  barLabel: { fontSize: 11, color: '#B0BACE' },

  bmiPill: {
    alignSelf: 'center', borderRadius: 24, borderWidth: 1.5,
    paddingHorizontal: 20, paddingVertical: 9, marginBottom: 8,
  },
  bmiText: { fontSize: 14, fontWeight: '700', letterSpacing: 0.2 },

  btnWrap: { marginTop: 8 },
  continueBtn: {
    backgroundColor: BLUE, borderRadius: 16,
    paddingVertical: 17, alignItems: 'center',
    shadowColor: BLUE, shadowOpacity: 0.35, shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 }, elevation: 6,
  },
  continueBtnText: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 0.3 },
});