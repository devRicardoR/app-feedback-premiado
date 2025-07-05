import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function EmpresaCadastro({ isEdit = false }) {
    const [nome, setNome] = useState("");
    const [cnpjCpf, setCnpjCpf] = useState("");
    const [endereco, setEndereco] = useState({
        rua: "",
        numero: "",
        bairro: "", // Campo adicionado
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
                    bairro: "", // Campo adicionado
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
                formData.append("fachada", fotoFachada); // Corrigido para usar o nome correto do campo
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
        <main className="flex-1 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded shadow p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                    {isEdit ? "Editar Perfil da Empresa" : "Cadastro Empresa"}
                </h1>

                {erro && (
                    <p className="mb-4 text-red-600 text-sm text-center">{erro}</p>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    encType="multipart/form-data"
                >
                    <input
                        type="text"
                        placeholder="Nome do estabelecimento"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800"
                    />
                    <input
                        type="text"
                        placeholder="CNPJ ou CPF"
                        value={cnpjCpf}
                        onChange={(e) => setCnpjCpf(e.target.value)}
                        required
                        disabled={isEdit}
                        className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-500"
                    />
                    <input
                        type="text"
                        placeholder="Rua"
                        value={endereco.rua}
                        onChange={(e) => handleEnderecoChange("rua", e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <input
                        type="text"
                        placeholder="Número"
                        value={endereco.numero}
                        onChange={(e) => handleEnderecoChange("numero", e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <input
                        type="text"
                        placeholder="Bairro"
                        value={endereco.bairro}
                        onChange={(e) => handleEnderecoChange("bairro", e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <input
                        type="text"
                        placeholder="Cidade"
                        value={endereco.cidade}
                        onChange={(e) => handleEnderecoChange("cidade", e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <input
                        type="text"
                        placeholder="Estado (UF)"
                        value={endereco.estado}
                        onChange={(e) => handleEnderecoChange("estado", e.target.value)}
                        required
                        maxLength={2}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <input
                        type="text"
                        placeholder="CEP"
                        value={endereco.cep}
                        onChange={(e) => handleEnderecoChange("cep", e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <input
                        type="password"
                        placeholder={
                            isEdit ? "Senha (deixe vazio para não alterar)" : "Senha"
                        }
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        {...(!isEdit && { required: true })}
                    />

                    <label className="block text-sm text-gray-700">
                        Foto da Fachada (opcional):
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFotoFachada(e.target.files[0])}
                            className="mt-1"
                        />
                    </label>

                    <button
                        type="submit"
                        className="w-full bg-yellow-400 text-white py-2 rounded hover:bg-yellow-500 transition"
                    >
                        {isEdit ? "Salvar Alterações" : "Cadastrar"}
                    </button>
                </form>
            </div>
        </main>
    );
}