import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    TextInput, Animated, StatusBar, KeyboardAvoidingView,
    Platform, ActivityIndicator,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

const BLUE = '#4A7BF7';
const DARK = '#1A1A2E';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;
    const btnScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]).start();
    }, []);

    const handleLogin = async () => {
        console.log('handleLogin вызван');
        console.log('email:', email);
        console.log('password:', password);

        if (!email || !password) {
            setError('Заполните все поля');
            return;
        }

        Animated.sequence([
            Animated.timing(btnScale, { toValue: 0.94, duration: 90, useNativeDriver: true }),
            Animated.timing(btnScale, { toValue: 1, duration: 150, useNativeDriver: true }),
        ]).start();

        setLoading(true);
        setError('');

        try {
            console.log('Отправляю запрос в Firebase...');
            const result = await signInWithEmailAndPassword(auth, email.trim(), password);
            console.log('Вход успешен:', result.user.email);
        } catch (e) {
            console.error('Ошибка входа:', e.code, e.message);
            switch (e.code) {
                case 'auth/user-not-found':
                    setError('Пользователь не найден');
                    break;
                case 'auth/wrong-password':
                    setError('Неверный пароль');
                    break;
                case 'auth/invalid-email':
                    setError('Неверный формат email');
                    break;
                case 'auth/invalid-credential':
                    setError('Неверный email или пароль');
                    break;
                default:
                    setError('Ошибка: ' + e.message);
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

            <Animated.View style={[styles.inner, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

                {/* Иконка */}
                <View style={styles.iconWrap}>
                    <Text style={styles.icon}>👋</Text>
                </View>

                {/* Заголовок */}
                <View style={styles.titleBlock}>
                    <Text style={styles.title}>С возвращением!</Text>
                    <Text style={styles.subtitle}>Войдите в свой аккаунт</Text>
                </View>

                {/* Поля */}
                <View style={styles.fieldsBlock}>
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

                    <View style={styles.inputWrap}>
                        <Text style={styles.inputLabel}>Пароль</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#B0BACE"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    {error ? (
                        <View style={styles.errorWrap}>
                            <Text style={styles.errorText}>⚠️ {error}</Text>
                        </View>
                    ) : null}
                </View>

                {/* Кнопка войти */}
                <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                    <TouchableOpacity
                        style={styles.loginBtn}
                        onPress={handleLogin}
                        activeOpacity={0.9}
                        disabled={loading}
                    >
                        {loading
                            ? <ActivityIndicator color="#fff" />
                            : <Text style={styles.loginBtnText}>Войти →</Text>
                        }
                    </TouchableOpacity>
                </Animated.View>

                {/* Регистрация */}
                <View style={styles.registerRow}>
                    <Text style={styles.registerText}>Нет аккаунта? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.registerLink}>Зарегистрироваться</Text>
                    </TouchableOpacity>
                </View>

            </Animated.View>
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

    inner: {
        flex: 1, paddingHorizontal: 28,
        paddingTop: 80, paddingBottom: 40,
        justifyContent: 'center',
    },

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

    errorWrap: {
        backgroundColor: '#FFF0F0', borderRadius: 12,
        padding: 12,
    },
    errorText: { fontSize: 13, color: '#F76A6A', fontWeight: '500' },

    loginBtn: {
        backgroundColor: BLUE, borderRadius: 16,
        paddingVertical: 17, alignItems: 'center',
        shadowColor: BLUE, shadowOpacity: 0.35, shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 }, elevation: 6,
        marginBottom: 20,
    },
    loginBtnText: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 0.3 },

    registerRow: { flexDirection: 'row', justifyContent: 'center' },
    registerText: { fontSize: 14, color: '#8E9BB5' },
    registerLink: { fontSize: 14, color: BLUE, fontWeight: '700' },
});