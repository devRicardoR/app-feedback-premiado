import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function EmpresaCadastro({ isEdit = false }) {
    const [nome, setNome] = useState("");
    const [cnpjCpf, setCnpjCpf] = useState("");
    const [endereco, setEndereco] = useState({
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
    });
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [fotoFachada, setFotoFachada] = useState(null);
    const [erro, setErro] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (isEdit) {
        carregarDados();
        }
    }, [isEdit]);

    async function carregarDados() {
        try {
        const res = await api.get("/empresas/me");
        const e = res.data;
        setNome(e.nome || "");
        setCnpjCpf(e.cnpj_cpf || "");
        setEmail(e.email || "");
        setEndereco(
            e.endereco || {
            rua: "",
            numero: "",
            bairro: "",
            cidade: "",
            estado: "",
            cep: "",
            }
        );
        } catch (error) {
        setErro("Erro ao carregar dados da empresa");
        console.error(error);
        }
    }

    const handleEnderecoChange = (field, value) => {
        setEndereco((prev) => ({ ...prev, [field]: value }));
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setErro("");

        try {
        const formData = new FormData();
        formData.append("nome", nome);
        formData.append("cnpj_cpf", cnpjCpf);
        formData.append("email", email);
        if (senha) {
            formData.append("senha", senha);
        }
        formData.append("endereco", JSON.stringify(endereco));
        if (fotoFachada) {
            formData.append("fachada", fotoFachada);
        }

        if (isEdit) {
            await api.put("/empresas/me", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Perfil atualizado com sucesso!");
            navigate("/empresa/painel");
        } else {
            await api.post("/empresas/cadastro", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Cadastro realizado com sucesso! Faça login.");
            navigate("/empresa/login");
        }
        } catch (error) {
        setErro(error.response?.data?.message || "Erro ao salvar");
        console.error(error);
        }
    }

    return (
        <main className="min-h-screen font-poppins bg-gradient-to-br from-brandRed via-brandOrange to-brandYellow text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white/20 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-lg">
            <h1
            className={`text-3xl font-extrabold mb-8 drop-shadow-lg text-center ${
                isEdit ? "text-[#7B1A1A]" : "text-white"
            }`}
            >
            {isEdit ? "Editar Perfil da Empresa" : "Cadastro Empresa"}
            </h1>

            {erro && (
            <p className="mb-6 text-red-500 text-sm text-center font-semibold">
                {erro}
            </p>
            )}

            <form
            onSubmit={handleSubmit}
            className="space-y-5"
            encType="multipart/form-data"
            >
            <input
                type="text"
                placeholder="Nome do estabelecimento"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="w-full px-5 py-3 rounded-2xl bg-white/25 placeholder-white/80 text-white font-semibold backdrop-blur-md outline-none focus:ring-4 focus:ring-white transition"
            />
            <input
                type="text"
                placeholder="CNPJ ou CPF"
                value={cnpjCpf}
                onChange={(e) => setCnpjCpf(e.target.value)}
                required
                disabled={isEdit}
                className="w-full px-5 py-3 rounded-2xl bg-white/25 placeholder-white/80 text-white font-semibold backdrop-blur-md outline-none focus:ring-4 focus:ring-white transition disabled:bg-white/10 disabled:text-white/50"
            />
            <input
                type="text"
                placeholder="Rua"
                value={endereco.rua}
                onChange={(e) => handleEnderecoChange("rua", e.target.value)}
                required
                className="w-full px-5 py-3 rounded-2xl bg-white/25 placeholder-white/80 text-white font-semibold backdrop-blur-md outline-none focus:ring-4 focus:ring-white transition"
            />
            <input
                type="text"
                placeholder="Número"
                value={endereco.numero}
                onChange={(e) => handleEnderecoChange("numero", e.target.value)}
                required
                className="w-full px-5 py-3 rounded-2xl bg-white/25 placeholder-white/80 text-white font-semibold backdrop-blur-md outline-none focus:ring-4 focus:ring-white transition"
            />
            <input
                type="text"
                placeholder="Bairro"
                value={endereco.bairro}
                onChange={(e) => handleEnderecoChange("bairro", e.target.value)}
                required
                className="w-full px-5 py-3 rounded-2xl bg-white/25 placeholder-white/80 text-white font-semibold backdrop-blur-md outline-none focus:ring-4 focus:ring-white transition"
            />
            <input
                type="text"
                placeholder="Cidade"
                value={endereco.cidade}
                onChange={(e) => handleEnderecoChange("cidade", e.target.value)}
                required
                className="w-full px-5 py-3 rounded-2xl bg-white/25 placeholder-white/80 text-white font-semibold backdrop-blur-md outline-none focus:ring-4 focus:ring-white transition"
            />
            <input
                type="text"
                placeholder="Estado (UF)"
                value={endereco.estado}
                onChange={(e) => handleEnderecoChange("estado", e.target.value)}
                required
                maxLength={2}
                className="w-full px-5 py-3 rounded-2xl bg-white/25 placeholder-white/80 text-white font-semibold backdrop-blur-md outline-none focus:ring-4 focus:ring-white transition"
            />
            <input
                type="text"
                placeholder="CEP"
                value={endereco.cep}
                onChange={(e) => handleEnderecoChange("cep", e.target.value)}
                required
                className="w-full px-5 py-3 rounded-2xl bg-white/25 placeholder-white/80 text-white font-semibold backdrop-blur-md outline-none focus:ring-4 focus:ring-white transition"
            />
            <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-3 rounded-2xl bg-white/25 placeholder-white/80 text-white font-semibold backdrop-blur-md outline-none focus:ring-4 focus:ring-white transition"
            />
            <input
                type="password"
                placeholder={
                isEdit ? "Senha (deixe vazio para não alterar)" : "Senha"
                }
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-5 py-3 rounded-2xl bg-white/25 placeholder-white/80 text-white font-semibold backdrop-blur-md outline-none focus:ring-4 focus:ring-white transition"
                {...(!isEdit && { required: true })}
            />

            <label className="block text-white font-semibold text-sm">
                Foto da Fachada (opcional):
                <input
                type="file"
                accept="image/*"
                onChange={(e) => setFotoFachada(e.target.files[0])}
                className="mt-2 cursor-pointer rounded-lg border border-green-500 bg-green-600 text-white px-3 py-1 font-semibold shadow-[0_0_8px_2px_rgba(16,185,129,0.9)] animate-pulse"
                />
            </label>

            <button
                type="submit"
                className="w-full bg-gradient-to-r from-brandRed via-brandOrange to-brandYellow text-white py-3 rounded-3xl font-extrabold shadow-lg hover:brightness-110 transition"
            >
                {isEdit ? "Salvar Alterações" : "Cadastrar"}
            </button>
            </form>
        </div>
        </main>
    );
}