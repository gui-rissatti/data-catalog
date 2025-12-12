import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import catalog from '../data/catalog.json';
import DatasetCard from '../components/DatasetCard';

export default function Home() {
    const [searchTerm, setSearchTerm] = useState('');
    // Note: we will need to update the catalog metadata to translated categories too
    // For now, let's keep logic simple
    const categories = ['Todos', ...new Set(catalog.map(d => d.category))];
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    const filteredData = catalog.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        // Logic for "Todos" implies matching everything, else match category
        const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 mb-10 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-12 -translate-y-12">
                    <div className="w-64 h-64 rounded-full bg-white blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-4xl font-extrabold mb-4 tracking-tight">
                        Catálogo de Dados Corporativo
                    </h1>
                    <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                        O hub central para todos os ativos de dados da empresa. Pesquise, explore e integre dados confiáveis em seus fluxos de trabalho.
                    </p>

                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 h-6 w-6 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Pesquise por datasets, métricas ou tags..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/30 shadow-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Filters and Grid */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filter */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="sticky top-24">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Filter className="h-4 w-4" /> Filtros
                        </h2>
                        <div className="space-y-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-white text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Dataset Grid */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900">
                            {filteredData.length} Dataset{filteredData.length !== 1 && 's'} Encontrado{filteredData.length !== 1 && 's'}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredData.map(dataset => (
                            <DatasetCard key={dataset.id} dataset={dataset} />
                        ))}
                    </div>

                    {filteredData.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                            <p className="text-slate-500">Nenhum dataset encontrado com esses critérios.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
