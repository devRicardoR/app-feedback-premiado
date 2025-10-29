import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { setToken } from '../services/api';

export default function EmpresaLogin() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleLogin() {
        if (!email || !senha) {
        Alert.alert('Erro', 'Preencha todos os campos.');
        return;
        }

        try {
        setLoading(true);
        const response = await api.post('/login', { email, senha, tipo: 'empresa' });
        const { token } = response.data;

        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('tipo', 'empresa');
        await setToken(token);

        router.push('/empresa/painel');
        } catch (error: any) {
        const msg = error.response?.data?.message || 'Erro ao fazer login.';
        Alert.alert('Erro', msg);
        } finally {
        setLoading(false);
        }
    }

    function voltarHome() {
        router.push('/');
    }

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Login Empresa</Text>

        <TextInput
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
        />

        <TextInput
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? (
            <ActivityIndicator color="#fff" />
            ) : (
            <Text style={styles.buttonText}>Entrar</Text>
            )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/empresa/cadastro')}>
            <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={voltarHome} style={styles.voltarButton}>
            <Text style={styles.voltarText}>Voltar para início</Text>
        </TouchableOpacity>
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 32,
        color: '#333',
    },
    input: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        width: '100%',
        backgroundColor: '#00875F',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
    },
    linkText: {
        color: '#555',
        fontSize: 15,
        marginBottom: 24,
    },
    voltarButton: {
        backgroundColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    voltarText: {
        color: '#333',
        fontWeight: '600',
    },
});