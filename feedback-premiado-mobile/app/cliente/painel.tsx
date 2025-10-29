import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import api, { setToken } from '../services/api';

interface Endereco {
    cidade?: string;
    rua?: string;
    numero?: string;
    }

    interface Empresa {
    _id: string;
    nome: string;
    endereco?: Endereco;
    printsConcluidos?: number;
    }

    interface RankingEmpresa {
    empresaId: string;
    posicao: number;
    nome: string;
    cidade?: string;
    totalPrints: number;
    }

    export default function PainelCliente() {
    const router = useRouter();
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [ranking, setRanking] = useState<RankingEmpresa[]>([]);
    const [loading, setLoading] = useState(true);

    async function carregarDados() {
        setLoading(true);
        try {
        const token = await AsyncStorage.getItem('token');
        if (token) await setToken(token);

        const [resEmpresas, resRanking] = await Promise.all([
            api.get<Empresa[]>('/empresas'),
            api.get<RankingEmpresa[]>('/empresas/ranking'),
        ]);

        setEmpresas(resEmpresas.data);
        setRanking(resRanking.data);
        } catch (err: any) {
        console.error('Erro ao carregar dados:', err);
        Alert.alert('Erro', err.response?.data?.message || err.message || 'Falha ao carregar dados');
        } finally {
        setLoading(false);
        }
    }

    useEffect(() => {
        carregarDados();
    }, []);

    async function handleLogout() {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('tipo');
        router.replace('/cliente/login');
    }

    if (loading) {
        return (
        <View style={styles.center}>
            <ActivityIndicator size="large" />
            <Text>Carregando...</Text>
        </View>
        );
    }

    return (
        <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
            <Text style={styles.title}>🔥 Feedback Premiado</Text>
            <Button title="Sair" onPress={handleLogout} />
        </View>

        {/* Ranking */}
        <Text style={styles.sectionTitle}>Ranking de empresas</Text>
        <FlatList
            data={ranking}
            keyExtractor={(item) => item.empresaId}
            renderItem={({ item }) => (
            <View style={styles.card}>
                <Text style={styles.cardTitle}>
                {item.posicao}. {item.nome}
                </Text>
                <Text>Cidade: {item.cidade || 'Não informada'}</Text>
                <Text>Total de prints: {item.totalPrints}</Text>
            </View>
            )}
            ListEmptyComponent={<Text>Nenhuma empresa encontrada.</Text>}
        />

        {/* Lista de todas as empresas */}
        <Text style={styles.sectionTitle}>Todas as empresas</Text>
        <FlatList
            data={empresas}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
            <View style={styles.card}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{item.nome}</Text>
                    <Text>Cidade: {item.endereco?.cidade || 'Não informada'}</Text>
                    <Text>Prints concluídos: {item.printsConcluidos || 0}</Text>
                </View>
                <TouchableOpacity
                    style={styles.botaoLoja}
                    onPress={() => router.push(`/cliente/loja/${item._id}`)}
                >
                    <Text style={styles.botaoLojaTexto}>Acessar loja</Text>
                </TouchableOpacity>
                </View>
            </View>
            )}
            ListEmptyComponent={<Text>Nenhuma empresa cadastrada.</Text>}
        />
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f2f2f2' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    title: { fontSize: 24, fontWeight: 'bold' },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
    card: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
    cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
    botaoLoja: { backgroundColor: '#5B1B29', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
    botaoLojaTexto: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});