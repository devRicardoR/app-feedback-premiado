import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import BotaoLogout from '../../components/BotaoLogout';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    } from 'recharts';

    import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
    import markerIcon from 'leaflet/dist/images/marker-icon.png';
    import markerShadow from 'leaflet/dist/images/marker-shadow.png';

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    });

    export default function ClientePainel() {
    const [lojas, setLojas] = useState([]);
    const [ranking, setRanking] = useState([]);
    const [busca, setBusca] = useState('');
    const [filtroCidade, setFiltroCidade] = useState('');
    const [localizacao, setLocalizacao] = useState([-25.4284, -49.2733]);

    useEffect(() => {
        async function carregarDados() {
        try {
            const [resLojas, resRanking] = await Promise.all([
            api.get('/empresas'),
            api.get('/empresas/ranking'),
            ]);
            setLojas(resLojas.data);
            setRanking(resRanking.data);
        } catch (e) {
            console.error('Erro ao carregar dados:', e);
        }
        }

        carregarDados();

        navigator.geolocation.getCurrentPosition(
        (pos) => {
            setLocalizacao([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
            console.warn('Erro ao obter localização:', err);
        }
        );
    }, []);

    const lojasFiltradas = lojas.filter(
        (loja) =>
        loja.nome?.toLowerCase().includes(busca.toLowerCase()) &&
        (filtroCidade === '' ||
            loja.endereco?.cidade?.toLowerCase() === filtroCidade.toLowerCase())
    );

    const maiorPontuacao = Math.max(...ranking.map((e) => e.totalPrints), 1);

    return (
        <div className="min-h-screen font-poppins bg-gradient-to-br from-brandRed via-brandOrange to-brandYellow text-white">
        <header className="p-5 flex justify-between items-center bg-white/20 backdrop-blur-md shadow-lg">
            <h1 className="text-3xl font-extrabold tracking-wide drop-shadow-lg">
            🔥 Feedback Premiado
            </h1>
            <BotaoLogout />
        </header>

        <section className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
            <input
                type="text"
                placeholder="🔍 Buscar loja por nome"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="flex-1 px-5 py-3 rounded-2xl bg-white/25 placeholder-white/80 text-white font-semibold backdrop-blur-md outline-none transition focus:ring-4 focus:ring-white"
            />
            <input
                type="text"
                placeholder="🏙️ Filtrar por cidade"
                value={filtroCidade}
                onChange={(e) => setFiltroCidade(e.target.value)}
                className="flex-1 px-5 py-3 rounded-2xl bg-white/25 placeholder-white/80 text-white font-semibold backdrop-blur-md outline-none transition focus:ring-4 focus:ring-white"
            />
            </div>

            {lojasFiltradas.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-brandOrange scrollbar-track-transparent">
                {lojasFiltradas.map((loja) => (
                <div
                    key={loja._id}
                    className="p-5 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg hover:scale-[1.03] transition-transform cursor-pointer"
                >
                    <Link
                    to={`/cliente/loja/${loja._id}`}
                    className="text-2xl font-bold text-white hover:underline"
                    >
                    {loja.nome}
                    </Link>
                    <p className="mt-1 text-white/90">
                    {loja.endereco?.rua}, {loja.endereco?.numero} -{' '}
                    {loja.endereco?.cidade || 'Cidade não informada'}
                    </p>
                    <Link
                    to={`/cliente/fidelidade/${loja._id}`}
                    className="inline-block mt-4 px-4 py-2 rounded-full bg-brandGreen font-semibold text-white shadow-lg hover:bg-green-600 transition"
                    >
                    Participar do programa fidelidade
                    </Link>
                </div>
                ))}
            </div>
            )}
        </section>

        <div className="h-[400px] w-full max-w-7xl mx-auto mb-12 rounded-3xl overflow-hidden shadow-lg border-4 border-white/40">
            <MapContainer
            center={localizacao}
            zoom={13}
            scrollWheelZoom={true}
            className="h-full w-full"
            >
            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {lojasFiltradas.map(
                (loja) =>
                loja.endereco?.localizacao?.coordinates && (
                    <Marker
                    key={loja._id}
                    position={[
                        loja.endereco.localizacao.coordinates[1],
                        loja.endereco.localizacao.coordinates[0],
                    ]}
                    >
                    <Popup className="text-black">
                        <strong>{loja.nome}</strong>
                        <br />
                        {loja.endereco?.rua}, {loja.endereco?.numero}
                        <br />
                        {loja.endereco?.cidade}
                        <br />
                        <Link
                        to={`/cliente/loja/${loja._id}`}
                        className="text-blue-700 underline hover:text-blue-900"
                        >
                        Ver detalhes
                        </Link>
                        <br />
                        <Link
                        to={`/cliente/fidelidade/${loja._id}`}
                        className="text-green-700 underline hover:text-green-900 mt-1 block"
                        >
                        Participar do programa fidelidade
                        </Link>
                    </Popup>
                    </Marker>
                )
            )}
            </MapContainer>
        </div>

        <main className="max-w-6xl mx-auto px-4 pb-16">
            <h2 className="text-4xl font-extrabold mb-8 drop-shadow-md text-white text-center">
            Ranking de empresas mais avaliadas
            </h2>

            <div className="w-full h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                data={ranking}
                margin={{ top: 20, right: 30, left: 30, bottom: 80 }}
                barCategoryGap="20%"
                >
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255 255 255 / 0.2)"
                />
                <XAxis
                    dataKey="nome"
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    height={100}
                    tick={{ fill: 'white', fontWeight: '600', fontSize: 12 }}
                />
                <YAxis
                    tick={{ fill: 'white', fontWeight: '600' }}
                    domain={[0, Math.ceil(maiorPontuacao * 1.1)]}
                />
                <Tooltip
                    contentStyle={{
                    backgroundColor: '#1f2937',
                    borderRadius: '8px',
                    border: 'none',
                    }}
                    itemStyle={{ color: '#F87171', fontWeight: '600' }}
                />
                <Bar
                    dataKey="totalPrints"
                    fill="#7B1A1A"
                    radius={[10, 10, 0, 0]}
                    maxBarSize={60}
                />
                </BarChart>
            </ResponsiveContainer>
            </div>
        </main>
        </div>
    );
}
