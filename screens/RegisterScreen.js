import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, Animated, StatusBar, KeyboardAvoidingView,
  Platform, ActivityIndicator, ScrollView,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const BLUE = '#4A7BF7';
const DARK = '#1A1A2E';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const btnScale  = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Заполните все поля');
      return;
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    if (password.length < 6) {
      setError('Пароль должен быть минимум 6 символов');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name: name.trim(),
        email: user.email,
        createdAt: new Date().toISOString(),
        onboardingDone: false,
      });

      navigation.navigate('Gender');

    } catch (e) {
      switch (e.code) {
        case 'auth/email-already-in-use':
          setError('Этот email уже используется');
          break;
        case 'auth/invalid-email':
          setError('Неверный формат email');
          break;
        case 'auth/weak-password':
          setError('Пароль слишком простой');
          break;
        default:
          setError('Ошибка регистрации. Попробуйте снова.');
      }
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.bgBlob1} />
      <View style={styles.bgBlob2} />

      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          <View style={styles.iconWrap}>
            <Text style={styles.icon}>🚀</Text>
          </View>

          <View style={styles.titleBlock}>
            <Text style={styles.title}>Создать аккаунт</Text>
            <Text style={styles.subtitle}>Начните отслеживать питание уже сегодня</Text>
          </View>

          <View style={styles.fieldsBlock}>

            {/* Имя */}
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Имя</Text>
              <TextInput
                style={styles.input}
                placeholder="Ваше имя"
                placeholderTextColor="#B0BACE"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            {/* Email */}
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor="#B0BACE"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Пароль */}
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Пароль</Text>
              <TextInput
                style={styles.input}
                placeholder="Минимум 6 символов"
                placeholderTextColor="#B0BACE"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Подтвердить пароль */}
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Подтвердите пароль</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#B0BACE"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            {error ? (
              <View style={styles.errorWrap}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            ) : null}
          </View>

          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={handleRegister}
              activeOpacity={0.9}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.registerBtnText}>Зарегистрироваться →</Text>
              }
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Уже есть аккаунт? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Войти</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
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

  inner: { paddingHorizontal: 28, paddingTop: 80, paddingBottom: 40 },

  iconWrap: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: '#EEF3FF', alignItems: 'center', justifyContent: 'center',
    marginBottom: 24, alignSelf: 'flex-start',
  },
  icon: { fontSize: 36 },

  titleBlock: { marginBottom: 32 },
  title: {
    fontSize: 34, fontWeight: '800', color: DARK,
    letterSpacing: -0.5, marginBottom: 8,
  },
  subtitle: { fontSize: 15, color: '#8E9BB5' },

  fieldsBlock: { marginBottom: 24, gap: 16 },
  inputWrap: { gap: 6 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: DARK },
  input: {
    backgroundColor: '#fff', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: DARK,
    borderWidth: 1.5, borderColor: '#E4E9F5',
  },

  errorWrap: { backgroundColor: '#FFF0F0', borderRadius: 12, padding: 12 },
  errorText: { fontSize: 13, color: '#F76A6A', fontWeight: '500' },

  registerBtn: {
    backgroundColor: BLUE, borderRadius: 16,
    paddingVertical: 17, alignItems: 'center',
    shadowColor: BLUE, shadowOpacity: 0.35, shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 }, elevation: 6,
    marginBottom: 20,
  },
  registerBtnText: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 0.3 },

  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { fontSize: 14, color: '#8E9BB5' },
  loginLink: { fontSize: 14, color: BLUE, fontWeight: '700' },
});