import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, StatusBar, ScrollView,
} from 'react-native';

const BLUE = '#4A7BF7';
const DARK = '#1A1A2E';

export default function TrainingAskScreen({ navigation, route }) {
  const { goal, targetCalories, termText, ...rest } = route.params || {};

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const yesScale  = useRef(new Animated.Value(1)).current;
  const noScale   = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handlePress = (answer, scaleRef) => {
    Animated.sequence([
      Animated.timing(scaleRef, { toValue: 0.93, duration: 90,  useNativeDriver: true }),
      Animated.timing(scaleRef, { toValue: 1,    duration: 150, useNativeDriver: true }),
    ]).start(() => {
      if (answer === 'yes') navigation.navigate('TrainingPlan', { goal, targetCalories, termText, ...rest });
      else navigation.navigate('PhotoTrack', { targetCalories, ...rest });
    });
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.bgBlob1} />
      <View style={styles.bgBlob2} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.inner, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

          {/* Icon */}
          <View style={styles.iconWrap}>
            <Text style={styles.heroIcon}>🏋️</Text>
          </View>

          {/* Badge + Title */}
          <View style={styles.textBlock}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Почти готово!</Text>
            </View>
            <Text style={styles.title}>Добавить программу{'\n'}тренировок?</Text>
            <Text style={styles.subtitle}>
              Мы составим индивидуальный план упражнений, сфокусированный на вашей цели —{' '}
              <Text style={styles.goalHighlight}>{goal || 'результате'}</Text>.
            </Text>
          </View>

          {/* Benefits */}
          <View style={styles.benefitsList}>
            {[
              { icon: '🎯', text: 'Адаптирован под вашу цель' },
              { icon: '📅', text: 'Расписание по дням недели' },
              { icon: '⚡', text: 'Ускорит достижение результата' },
            ].map((b) => (
              <View key={b.text} style={styles.benefitRow}>
                <View style={styles.benefitIconWrap}>
                  <Text style={styles.benefitIcon}>{b.icon}</Text>
                </View>
                <Text style={styles.benefitText}>{b.text}</Text>
              </View>
            ))}
          </View>

          {/* Buttons */}
          <View style={styles.btnsCol}>
            <Animated.View style={{ transform: [{ scale: yesScale }] }}>
              <TouchableOpacity
                style={styles.yesBtn}
                onPress={() => handlePress('yes', yesScale)}
                activeOpacity={0.9}
              >
                <Text style={styles.yesBtnText}>Да, создать план 🚀</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={{ transform: [{ scale: noScale }] }}>
              <TouchableOpacity
                style={styles.noBtn}
                onPress={() => handlePress('no', noScale)}
                activeOpacity={0.85}
              >
                <Text style={styles.noBtnText}>Пропустить</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F6FB', overflow: 'hidden' },

  bgBlob1: {
    position: 'absolute', width: 320, height: 320, borderRadius: 160,
    backgroundColor: 'rgba(74,123,247,0.08)', top: -80, right: -80,
  },
  bgBlob2: {
    position: 'absolute', width: 240, height: 240, borderRadius: 120,
    backgroundColor: 'rgba(74,247,160,0.07)', bottom: 80, left: -70,
  },

  scroll: { flexGrow: 1 },

  inner: {
    paddingHorizontal: 28,
    paddingTop: 50,
    paddingBottom: 52,
    gap: 28,
  },

  iconWrap: {
    width: 96, height: 96, borderRadius: 28,
    marginBottom: -20,
    backgroundColor: '#EEF3FF',
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'flex-start',
    shadowColor: BLUE, shadowOpacity: 0.12, shadowRadius: 12, elevation: 4,
  },
  heroIcon: { fontSize: 46 },

  textBlock: { gap: 10 },
  badge: {
    alignSelf: 'flex-start', backgroundColor: '#EEF3FF',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
  },
  badgeText: { fontSize: 12, color: BLUE, fontWeight: '700', letterSpacing: 0.3 },
  title: {
    fontSize: 34, fontWeight: '800', color: DARK,
    lineHeight: 42, letterSpacing: -0.5,
  },
  subtitle: { fontSize: 15, color: '#8E9BB5', lineHeight: 22 },
  goalHighlight: { color: DARK, fontWeight: '700' },

  benefitsList: { gap: 10 },
  benefitRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#fff', borderRadius: 16, padding: 14,
    shadowColor: DARK, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  benefitIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#F4F6FB', alignItems: 'center', justifyContent: 'center',
  },
  benefitIcon: { fontSize: 18 },
  benefitText: { fontSize: 14, fontWeight: '600', color: DARK },

  btnsCol: { gap: 12 },
  yesBtn: {
    backgroundColor: BLUE, borderRadius: 16,
    paddingVertical: 17, alignItems: 'center',
    shadowColor: BLUE, shadowOpacity: 0.35, shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 }, elevation: 6,
  },
  yesBtnText: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 0.2 },
  noBtn: {
    borderRadius: 16, paddingVertical: 15, alignItems: 'center',
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E4E9F5',
  },
  noBtnText: { fontSize: 16, fontWeight: '600', color: '#8E9BB5' },
});