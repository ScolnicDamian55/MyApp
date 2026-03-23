import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ImageBackground,
  TouchableOpacity, Animated, StatusBar, Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const BLUE = '#4A7BF7';

export default function WelcomeScreen({ navigation }) {
  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const slideAnim  = useRef(new Animated.Value(60)).current;
  const scaleAnim  = useRef(new Animated.Value(0.85)).current;
  const btnScale   = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, delay: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.94, duration: 90,  useNativeDriver: true }),
      Animated.timing(btnScale, { toValue: 1,    duration: 150, useNativeDriver: true }),
    ]).start(() => navigation.navigate('Register'));
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />

      <ImageBackground
        source={require('../assets/logo.png')}
        style={styles.bg}
        resizeMode="cover"
      >
        <View style={styles.gradientTop} />
        <View style={styles.gradientBottom} />
      </ImageBackground>

      {/* Top badge */}
      <Animated.View style={[styles.topBadge, { opacity: fadeAnim }]}>
        <View style={styles.badgeDot} />
        <Text style={styles.badgeText}>Умный трекер питания</Text>
      </Animated.View>

      {/* Bottom content */}
      <Animated.View
        style={[
          styles.bottom,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Feature pills */}
        <View style={styles.pillsRow}>
          {[
            { icon: '📸', text: 'Фото-трекинг' },
            { icon: '🔥', text: 'Калории' },
            { icon: '💪', text: 'Тренировки' },
          ].map((p) => (
            <View key={p.text} style={styles.pill}>
              <Text style={styles.pillIcon}>{p.icon}</Text>
              <Text style={styles.pillText}>{p.text}</Text>
            </View>
          ))}
        </View>

        {/* Headline */}
        <Text style={styles.title}>Знай,{'\n'}что ты ешь</Text>
        <Text style={styles.subtitle}>
          Персональный план питания и тренировок за 2 минуты
        </Text>

        {/* Кнопка Начать */}
        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
          <TouchableOpacity style={styles.btn} onPress={handlePress} activeOpacity={0.9}>
            <Text style={styles.btnText}>Начать →</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.finePrint}>Бесплатно · Без ограничений</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0A0A14' },

  bg: { position: 'absolute', width, height },
  gradientTop: {
    position: 'absolute', top: 0, left: 0, right: 0, height: height * 0.4,
    backgroundColor: 'rgba(10,10,20,0.45)',
  },
  gradientBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: height * 0.65,
    backgroundColor: 'rgba(10,10,20,0.82)',
  },

  topBadge: {
    position: 'absolute', top: 58, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
  },
  badgeDot: {
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: '#4AF7A0',
  },
  badgeText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  bottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 28, paddingBottom: 52, paddingTop: 24,
  },

  pillsRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
  },
  pillIcon: { fontSize: 13 },
  pillText: { color: '#fff', fontSize: 12, fontWeight: '600' },

  title: {
    fontSize: 52, fontWeight: '800', color: '#fff',
    lineHeight: 58, letterSpacing: -1.5, marginBottom: 12,
  },
  subtitle: {
    fontSize: 16, color: 'rgba(255,255,255,0.6)',
    lineHeight: 23, marginBottom: 32,
  },

  btn: {
    backgroundColor: BLUE, borderRadius: 18,
    paddingVertical: 18, alignItems: 'center',
    shadowColor: BLUE, shadowOpacity: 0.5,
    shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 10,
    marginBottom: 12,
  },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 0.3 },

  finePrint: {
    textAlign: 'center', color: 'rgba(255,255,255,0.35)',
    fontSize: 12, fontWeight: '500',
  },
});