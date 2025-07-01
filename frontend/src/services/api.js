import axios from 'axios';

// URL base do backend
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Função para setar o token no header Authorization
export function setToken(token) {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
}

export default api;