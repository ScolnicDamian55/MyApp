import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  StatusBar,
} from 'react-native';

const BLUE = '#4A7BF7';
const DARK = '#1A1A2E';

const options = [
  {
    key: 'Малоподвижный',
    icon: '🛋️',
    desc: 'Мало или совсем нет физической активности',
    color: '#F76A6A',
    lightColor: '#FFF0F0',
  },
  {
    key: 'Легкий',
    icon: '🚶',
    desc: 'Упражнения 1–2 раза в неделю, прогулки',
    color: '#F7A84A',
    lightColor: '#FFF7ED',
  },
  {
    key: 'Средний',
    icon: '🚴',
    desc: 'Упражнения 3–4 раза в неделю, умеренно активный',
    color: '#4AC8F7',
    lightColor: '#EDF8FF',
  },
  {
    key: 'Активный',
    icon: '🏋️',
    desc: 'Упражнения 5–6 раз в неделю, физически тяжёлая работа',
    color: '#4A7BF7',
    lightColor: '#EEF3FF',
  },
  {
    key: 'Очень активный',
    icon: '🔥',
    desc: 'Интенсивные тренировки каждый день',
    color: '#A44AF7',
    lightColor: '#F5EEFF',
  },
];

export default function ActivityScreen({ navigation, route }) {
  const [selected, setSelected] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const itemAnims = useRef(options.map(() => new Animated.Value(0))).current;
  const pressScale = useRef(options.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();

    options.forEach((_, i) => {
      Animated.timing(itemAnims[i], {
        toValue: 1,
        duration: 400,
        delay: 150 + i * 80,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const handleSelect = (opt, index) => {
    setSelected(opt.key);
    Animated.sequence([
      Animated.timing(pressScale[index], { toValue: 0.96, duration: 90, useNativeDriver: true }),
      Animated.timing(pressScale[index], { toValue: 1, duration: 160, useNativeDriver: true }),
    ]).start(() => {
      const { gender, age, height, currentWeight, desiredWeight } = route.params || {};
      navigation.navigate('Plan', {
        gender, age, height, currentWeight, desiredWeight, activity: opt.key,
      });
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Background blobs */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.stepIndicator}>
          <View style={[styles.dot, styles.dotDone]} />
          <View style={[styles.dot, styles.dotDone]} />
          <View style={[styles.dot, styles.dotDone]} />
          <View style={[styles.dot, styles.dotDone]} />
          <View style={[styles.dot, styles.dotActive]} />
        </View>
        <Text style={styles.stepText}>Шаг 5 из 5</Text>
      </Animated.View>

      <Animated.View style={[styles.titleBlock, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.title}>Уровень{'\n'}активности</Text>
        <Text style={styles.subtitle}>Выберите вариант, который лучше всего описывает вашу активность</Text>
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {options.map((opt, i) => {
          const isSelected = selected === opt.key;
          return (
            <Animated.View
              key={opt.key}
              style={{
                opacity: itemAnims[i],
                transform: [
                  { translateY: itemAnims[i].interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
                  { scale: pressScale[i] },
                ],
              }}
            >
              <TouchableOpacity
                style={[
                  styles.card,
                  isSelected && { borderColor: opt.color, backgroundColor: opt.lightColor },
                ]}
                onPress={() => handleSelect(opt, i)}
                activeOpacity={0.85}
              >
                {/* Left accent bar */}
                <View style={[styles.accentBar, { backgroundColor: opt.color }]} />

                <View style={[styles.iconWrap, { backgroundColor: opt.lightColor }]}>
                  <Text style={styles.icon}>{opt.icon}</Text>
                </View>

                <View style={styles.cardText}>
                  <Text style={[styles.optionName, isSelected && { color: opt.color }]}>
                    {opt.key}
                  </Text>
                  <Text style={styles.optionDesc}>{opt.desc}</Text>
                </View>

                {isSelected && (
                  <View style={[styles.checkBadge, { backgroundColor: opt.color }]}>
                    <Text style={styles.checkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
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
  },

  bgCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(74,123,247,0.07)',
    top: -80,
    right: -80,
  },
  bgCircle2: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(164,74,247,0.06)',
    bottom: 40,
    left: -60,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: 6,
    marginRight: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D0D5E8',
  },
  dotDone: {
    backgroundColor: '#B0C4F8',
  },
  dotActive: {
    backgroundColor: BLUE,
    width: 24,
  },
  stepText: {
    fontSize: 13,
    color: '#8E9BB5',
    fontWeight: '500',
    letterSpacing: 0.3,
  },

  titleBlock: {
    marginBottom: 24,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: DARK,
    lineHeight: 46,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8E9BB5',
    lineHeight: 20,
  },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40, gap: 12 },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },

  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },

  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginRight: 14,
  },
  icon: {
    fontSize: 26,
  },

  cardText: { flex: 1 },
  optionName: {
    fontSize: 16,
    fontWeight: '700',
    color: DARK,
    marginBottom: 3,
  },
  optionDesc: {
    fontSize: 12,
    color: '#8E9BB5',
    lineHeight: 17,
  },

  checkBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  checkText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
});