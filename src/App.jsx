import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Zap, BarChart3 } from 'lucide-react';
import PriceTable from './components/PriceTable';
import PriceChart from './components/PriceChart';
import { fetchAlbionPrices } from './services/albionApi';

export default function App() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState(null);
  const [activeTab, setActiveTab] = useState('table');

  useEffect(() => {
    const loadPrices = async () => {
      try {
        setLoading(true);
        const data = await fetchAlbionPrices();
        setResources(data);
        setFilteredResources(data);
      } catch (error) {
        console.error('Erro ao buscar preços:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPrices();
    const interval = setInterval(loadPrices, 60000); // Atualizar a cada minuto
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = resources.filter(r =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'price':
          return b.price - a.price;
        case 'change':
          return (b.priceChange || 0) - (a.priceChange || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredResources(filtered);
  }, [searchTerm, sortBy, resources]);

  const stats = {
    totalResources: resources.length,
    avgPrice: resources.length > 0 ? (resources.reduce((sum, r) => sum + r.price, 0) / resources.length).toFixed(2) : 0,
    trending: resources.filter(r => (r.priceChange || 0) > 0).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navbar */}
      <nav className="bg-slate-900/80 backdrop-blur border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="text-purple-500 w-8 h-8" />
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Albion Price Tracker
              </h1>
            </div>
            <p className="text-slate-400 text-sm">
              Última atualização: {new Date().toLocaleTimeString('pt-BR')}
            </p>
          </div>
        </div>
      </nav>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur border border-purple-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Recursos Totais</p>
                <p className="text-3xl font-bold text-purple-400">{stats.totalResources}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-purple-500/20" />
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-blue-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Preço Médio</p>
                <p className="text-3xl font-bold text-blue-400">{stats.avgPrice}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-500/20" />
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-green-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Em Alta</p>
                <p className="text-3xl font-bold text-green-400">{stats.trending}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500/20" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-slate-800/50 backdrop-blur border border-purple-500/20 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Procurar recurso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-50 focus:outline-none focus:border-purple-500"
            >
              <option value="name">Ordenar por Nome</option>
              <option value="price">Ordenar por Preço</option>
              <option value="change">Ordenar por Mudança</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('table')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'table'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Tabela
          </button>
          <button
            onClick={() => { setActiveTab('chart'); setSelectedResource(filteredResources[0]); }}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'chart'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Gráfico
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <Zap className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Carregando preços...</p>
          </div>
        ) : activeTab === 'table' ? (
          <PriceTable resources={filteredResources} />
        ) : (
          <PriceChart resource={selectedResource} />
        )}
      </div>
    </div>
  );
}