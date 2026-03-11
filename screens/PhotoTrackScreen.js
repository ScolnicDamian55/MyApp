import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity, Animated, StatusBar,
  Dimensions, ScrollView,
} from 'react-native';

const { height } = Dimensions.get('window');
const BLUE = '#4A7BF7';
const DARK = '#1A1A2E';

const TIPS = [
  {
    icon: '📸',
    title: 'Сфотографируйте блюдо',
    desc: 'Нажмите кнопку «+» на главном экране и выберите камеру или галерею',
    color: '#EEF3FF',
    accent: BLUE,
  },
  {
    icon: '🎯',
    title: 'Снимайте крупным планом',
    desc: 'Чем лучше видно блюдо — тем точнее ИИ определит состав и КБЖУ',
    color: '#FFF7ED',
    accent: '#F7A84A',
  },
  {
    icon: '⏱️',
    title: 'Подождите 10-30 секунд',
    desc: 'ИИ анализирует фото и автоматически рассчитывает калории, белки, жиры и углеводы',
    color: '#F0FFF8',
    accent: '#4AF7A0',
  },
  {
    icon: '✅',
    title: 'Добавьте в дневник',
    desc: 'Проверьте результат и нажмите «Добавить в дневник» — данные сохранятся',
    color: '#FFF0F5',
    accent: '#F76A9A',
  },
];

export default function PhotoTrackScreen({ navigation, route }) {
  const params = route.params || {};

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const itemAnims = useRef(TIPS.map(() => new Animated.Value(0))).current;
  const btnScale  = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();

    TIPS.forEach((_, i) => {
      Animated.timing(itemAnims[i], {
        toValue: 1, duration: 400, delay: 200 + i * 100, useNativeDriver: true,
      }).start();
    });
  }, []);

  const handleStart = () => {
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.94, duration: 90,  useNativeDriver: true }),
      Animated.timing(btnScale, { toValue: 1,    duration: 150, useNativeDriver: true }),
    ]).start(() => navigation.navigate('Home', params));
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
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.heroIconWrap}>
            <Text style={styles.heroIcon}>🤖</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ИИ Фото-трекинг</Text>
          </View>
          <Text style={styles.title}>Как это{'\n'}работает?</Text>
          <Text style={styles.subtitle}>
            Просто сфотографируйте еду — ИИ сам посчитает КБЖУ и добавит в ваш дневник
          </Text>
        </Animated.View>

        {/* Tips */}
        <View style={styles.tipsSection}>
          {TIPS.map((tip, i) => (
            <Animated.View
              key={tip.title}
              style={{
                opacity: itemAnims[i],
                transform: [{
                  translateY: itemAnims[i].interpolate({
                    inputRange: [0, 1], outputRange: [24, 0],
                  }),
                }],
              }}
            >
              <View style={[styles.tipCard, { borderLeftColor: tip.accent }]}>
                <View style={[styles.tipIconWrap, { backgroundColor: tip.color }]}>
                  <Text style={styles.tipIcon}>{tip.icon}</Text>
                </View>
                <View style={styles.tipText}>
                  <View style={styles.tipTitleRow}>
                    <View style={[styles.stepNum, { backgroundColor: tip.accent }]}>
                      <Text style={styles.stepNumText}>{i + 1}</Text>
                    </View>
                    <Text style={styles.tipTitle}>{tip.title}</Text>
                  </View>
                  <Text style={styles.tipDesc}>{tip.desc}</Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* CTA */}
        <Animated.View style={[styles.btnWrap, { transform: [{ scale: btnScale }] }]}>
          <TouchableOpacity style={styles.startBtn} onPress={handleStart} activeOpacity={0.9}>
            <Text style={styles.startBtnText}>Перейти к дневнику →</Text>
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

  scroll: { paddingHorizontal: 24, paddingTop: 64, paddingBottom: 40 },

  // Header
  header: { marginBottom: 32 },
  heroIconWrap: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: '#EEF3FF', alignItems: 'center', justifyContent: 'center',
    marginBottom: 16, alignSelf: 'flex-start',
    shadowColor: BLUE, shadowOpacity: 0.12, shadowRadius: 12, elevation: 4,
  },
  heroIcon: { fontSize: 38 },
  badge: {
    alignSelf: 'flex-start', backgroundColor: '#EEF3FF',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 12,
  },
  badgeText: { fontSize: 12, color: BLUE, fontWeight: '700', letterSpacing: 0.3 },
  title: {
    fontSize: 36, fontWeight: '800', color: DARK,
    lineHeight: 44, letterSpacing: -0.5, marginBottom: 10,
  },
  subtitle: { fontSize: 15, color: '#8E9BB5', lineHeight: 22 },

  // Tips
  tipsSection: { gap: 12, marginBottom: 20 },
  tipCard: {
    backgroundColor: '#fff', borderRadius: 18,
    flexDirection: 'row', alignItems: 'flex-start',
    padding: 16, gap: 14,
    borderLeftWidth: 3,
    shadowColor: DARK, shadowOpacity: 0.06,
    shadowRadius: 10, elevation: 3,
  },
  tipIconWrap: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  tipIcon: { fontSize: 22 },
  tipText: { flex: 1 },
  tipTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 },
  stepNum: {
    width: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  stepNumText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  tipTitle: { fontSize: 14, fontWeight: '700', color: DARK, flex: 1 },
  tipDesc: { fontSize: 13, color: '#8E9BB5', lineHeight: 19 },

  // Info
  infoBlock: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#FFFBEA', borderRadius: 16,
    padding: 14, marginBottom: 24,
    borderWidth: 1, borderColor: '#F7E9A0',
  },
  infoIcon: { fontSize: 18 },
  infoText: { flex: 1, fontSize: 13, color: '#8A7A30', lineHeight: 19 },

  // Button
  btnWrap: {},
  startBtn: {
    backgroundColor: BLUE, borderRadius: 16,
    paddingVertical: 17, alignItems: 'center',
    shadowColor: BLUE, shadowOpacity: 0.35, shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 }, elevation: 6,
  },
  startBtnText: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 0.3 },
});