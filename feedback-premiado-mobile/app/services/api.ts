// services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
    baseURL: `${API_URL}/api`,
    });

    // Função para setar o token nas requisições
    export async function setToken(token?: string) {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
    }

    // Interceptor para garantir token salvo nas requisições
    api.interceptors.request.use(async (config) => {
    if (!config.headers?.Authorization) {
        const t = await AsyncStorage.getItem('token');
        if (t) config.headers.Authorization = `Bearer ${t}`;
    }
    return config;
    });

    // Função para buscar endereço pelo CEP via ViaCEP
    export async function getEnderecoByCep(cep: string) {
    try {
        const cleanedCep = cep.replace(/\D/g, '');
        if (cleanedCep.length !== 8) throw new Error('CEP inválido');

        const res = await axios.get(`https://viacep.com.br/ws/${cleanedCep}/json/`);
        if (res.data.erro) throw new Error('CEP não encontrado');

        return {
        rua: res.data.logradouro || '',
        bairro: res.data.bairro || '',
        cidade: res.data.localidade || '',
        estado: res.data.uf || '',
        cep: cleanedCep,
        };
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        return null;
    }
}

export default api;