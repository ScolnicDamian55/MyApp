import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function GenderScreen({ navigation }) {
  const [selectedGender, setSelectedGender] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const maleScale = useRef(new Animated.Value(1)).current;
  const femaleScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSelect = (gender) => {
    setSelectedGender(gender);
    const scale = gender === 'Мужской' ? maleScale : femaleScale;
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.94, duration: 100, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      navigation.navigate('Age', { gender });
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Background decoration */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.stepIndicator}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
          <Text style={styles.stepText}>Шаг 1 из 3</Text>
        </View>

        {/* Title block */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Какой{'\n'}у вас пол?</Text>
          <Text style={styles.subtitle}>
            Пол влияет на естественное{'\n'}потребление калорий
          </Text>
        </View>

        {/* Gender cards */}
        <View style={styles.cardsRow}>
          {/* Male */}
          <Animated.View style={{ transform: [{ scale: maleScale }], flex: 1 }}>
            <TouchableOpacity
              style={[
                styles.card,
                selectedGender === 'Мужской' && styles.cardSelected,
              ]}
              onPress={() => handleSelect('Мужской')}
              activeOpacity={0.85}
            >
              <View style={styles.iconWrap}>
                <Text style={styles.cardIcon}>♂</Text>
              </View>
              <Text
                style={[
                  styles.cardLabel,
                  selectedGender === 'Мужской' && styles.cardLabelSelected,
                ]}
              >
                Мужской
              </Text>
              {selectedGender === 'Мужской' && (
                <View style={styles.checkBadge}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Female */}
          <Animated.View style={{ transform: [{ scale: femaleScale }], flex: 1 }}>
            <TouchableOpacity
              style={[
                styles.card,
                selectedGender === 'Женский' && styles.cardSelectedFemale,
              ]}
              onPress={() => handleSelect('Женский')}
              activeOpacity={0.85}
            >
              <View style={styles.iconWrap}>
                <Text style={styles.cardIcon}>♀</Text>
              </View>
              <Text
                style={[
                  styles.cardLabel,
                  selectedGender === 'Женский' && styles.cardLabelSelected,
                ]}
              >
                Женский
              </Text>
              {selectedGender === 'Женский' && (
                <View style={[styles.checkBadge, styles.checkBadgeFemale]}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Text style={styles.hint}>Нажмите на карточку, чтобы продолжить</Text>
      </Animated.View>
    </View>
  );
}

const BLUE = '#4A7BF7';
const PINK = '#F76A9A';
const DARK = '#1A1A2E';
const CARD_BG = '#FFFFFF';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
    overflow: 'hidden',
  },

  // Decorative background blobs
  bgCircle1: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(74,123,247,0.08)',
    top: -80,
    right: -80,
  },
  bgCircle2: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(247,106,154,0.07)',
    bottom: 60,
    left: -60,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },

  // Step indicator
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 48,
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

  // Title
  titleBlock: {
    marginBottom: 48,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: DARK,
    lineHeight: 46,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#8E9BB5',
    lineHeight: 22,
    fontWeight: '400',
  },

  // Cards
  cardsRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 28,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 12,
    alignItems: 'center',
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  cardSelected: {
    borderColor: BLUE,
    backgroundColor: '#EEF3FF',
  },
  cardSelectedFemale: {
    borderColor: PINK,
    backgroundColor: '#FFF0F5',
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F4F6FB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    fontSize: 36,
    color: DARK,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: DARK,
    letterSpacing: 0.2,
  },
  cardLabelSelected: {
    color: DARK,
  },

  // Check badge
  checkBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBadgeFemale: {
    backgroundColor: PINK,
  },
  checkText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  hint: {
    textAlign: 'center',
    fontSize: 13,
    color: '#B0BACE',
    fontWeight: '400',
  },
});