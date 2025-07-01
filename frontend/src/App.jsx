import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Escolha usuario login
import EscolhaUsuario from './pages/EscolhaUsuario';

// Cliente
import ClienteCadastro from './pages/cliente/Cadastro';
import ClienteLogin from './pages/cliente/Login';
import ClientePainel from './pages/cliente/Painel';
import LojaDetalhes from './pages/cliente/LojaDetalhes';

// Empresa
import EmpresaCadastro from './pages/empresa/Cadastro';
import EmpresaLogin from './pages/empresa/Login';
import EmpresaPainel from './pages/empresa/Painel';
import EmpresaRanking from './pages/empresa/Ranking';
import TarefasDaEmpresa from './pages/empresa/TarefasDaEmpresa';

// Proteção de rotas
import RotaProtegida from './components/RotaProtegida';

// Logout
import Logout from './components/Logout';

function App() {
    return (
        <Routes>
            <Route path="/" element={<EscolhaUsuario />} />

            {/* Cliente */}
            <Route path="/cliente/cadastro" element={<ClienteCadastro />} />
            <Route path="/cliente/login" element={<ClienteLogin />} />
            <Route
                path="/cliente/painel"
                element={
                    <RotaProtegida tipo="cliente">
                        <ClientePainel />
                    </RotaProtegida>
                }
            />
            <Route
                path="/cliente/loja/:id"
                element={
                    <RotaProtegida tipo="cliente">
                        <LojaDetalhes />
                    </RotaProtegida>
                }
            />

            {/* Empresa */}
            <Route path="/empresa/cadastro" element={<EmpresaCadastro />} />
            <Route path="/empresa/login" element={<EmpresaLogin />} />
            <Route path="/empresa/:id/tarefas" element={<TarefasDaEmpresa />} />
            <Route
                path="/empresa/painel"
                element={
                    <RotaProtegida tipo="empresa">
                        <EmpresaPainel />
                    </RotaProtegida>
                }
            />
            <Route
                path="/empresa/ranking"
                element={
                    <RotaProtegida tipo="empresa">
                        <EmpresaRanking />
                    </RotaProtegida>
                }
            />
            <Route
                path="/empresa/editar"
                element={
                    <RotaProtegida tipo="empresa">
                        <EmpresaCadastro isEdit={true} />
                    </RotaProtegida>
                }
            />

            {/* Logout */}
            <Route path="/logout" element={<Logout />} />
        </Routes>
    );
}

export default App;