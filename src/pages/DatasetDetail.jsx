import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Shield, Tag, Database, Copy, Check, Terminal, Layers } from 'lucide-react';
import catalog from '../data/catalog.json';
import SchemaTable from '../components/SchemaTable';
import DataLineage from '../components/DataLineage';

const KNOWN_KEYS = [
    'id', 'title', 'description', 'schema', 'layer', 'platform',
    'catalog_path', 'location', 'owner', 'tags', 'sample_query'
];

export default function DatasetDetail() {
    const { id } = useParams();
    const dataset = catalog.find(d => d.id === id);
    const [copied, setCopied] = useState(false);

    if (!dataset) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-slate-900">Dataset não encontrado</h2>
                <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Voltar ao Início</Link>
            </div>
        );
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const additionalMetadata = dataset ? Object.entries(dataset).filter(([key]) => !KNOWN_KEYS.includes(key)) : [];

    const getLayerColor = (layer) => {
        switch (layer?.toLowerCase()) {
            case 'bronze': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'silver': return 'bg-slate-200 text-slate-700 border-slate-300';
            case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-blue-50 text-blue-700 border-blue-100';
        }
    };

    return (
        <div>
            <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" /> Voltar ao Catálogo
            </Link>

            {/* Header */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide border ${getLayerColor(dataset.layer)}`}>
                                Camada {dataset.layer || 'Unclassified'}
                            </span>
                            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-blue-100">
                                {dataset.platform || 'Databricks'}
                            </span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">{dataset.title}</h1>
                        <p className="text-slate-600 text-lg max-w-3xl leading-relaxed">
                            {dataset.description}
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 min-w-[240px] bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Caminho no Catálogo</h3>
                        <div className="flex items-center gap-2 text-sm font-mono text-slate-700 bg-white px-3 py-2 rounded border border-slate-200 break-all select-all">
                            {dataset.catalog_path}
                        </div>
                        <button
                            onClick={() => copyToClipboard(dataset.catalog_path)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center justify-end gap-1"
                        >
                            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            {copied ? 'Copiado' : 'Copiar Caminho'}
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                            {dataset.owner.charAt(0)}
                        </div>
                        <div>
                            <span className="block text-xs text-slate-400">Proprietário</span>
                            <span className="font-semibold text-slate-900">{dataset.owner}</span>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

                    <div className="flex items-center gap-2">
                        {dataset.tags.map(tag => (
                            <span key={tag} className="inline-flex items-center text-xs bg-slate-50 text-slate-500 px-2.5 py-1 rounded-md border border-slate-200">
                                <Tag className="h-3 w-3 mr-1 opacity-50" /> {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Access & Query */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Access Instructions */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                            <Terminal className="h-5 w-5 text-slate-500" />
                            <h3 className="font-semibold text-slate-900">Acesso & Uso</h3>
                        </div>
                        <div className="p-6">
                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-slate-700 mb-2">Exemplo de Query</h4>
                                <div className="bg-slate-900 rounded-lg p-4 relative group">
                                    <pre className="text-blue-300 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                                        <code>{dataset.sample_query || 'SELECT * FROM ' + dataset.catalog_path}</code>
                                    </pre>
                                    <button
                                        onClick={() => copyToClipboard(dataset.sample_query)}
                                        className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Copiar Query"
                                    >
                                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-slate-700 mb-2">Localização Física</h4>
                                <code className="text-sm bg-slate-100 px-3 py-1 rounded text-slate-600 block w-full">
                                    {dataset.location}
                                </code>
                            </div>
                        </div>
                    </div>

                    {/* Schema */}
                    <SchemaTable schema={dataset.schema} />
                </div>

                {/* Right Col: Lineage & Context */}
                <div className="space-y-6">
                    <DataLineage currentLayer={dataset.layer} title={dataset.title} />
                </div>
            </div>

            {/* Additional Metadata Section - Dynamic Rendering for Unity Catalog */}
            {additionalMetadata.length > 0 && (
                <div className="mt-8 bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                        <Database className="h-5 w-5 text-slate-500" />
                        <h3 className="font-semibold text-slate-900">Metadados Adicionais</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {additionalMetadata.map(([key, value]) => (
                            <div key={key} className="px-6 py-4 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 hover:bg-slate-50/50 transition-colors">
                                <span className="text-sm font-bold text-slate-500 sm:w-1/4 uppercase tracking-wider pt-1">
                                    {key.replace(/_/g, ' ')}
                                </span>
                                <div className="text-sm text-slate-900 font-mono break-all flex-1 bg-slate-50 rounded p-2 border border-slate-100">
                                    {typeof value === 'object' ? (
                                        <pre className="whitespace-pre-wrap font-mono text-xs text-slate-600">
                                            {JSON.stringify(value, null, 2)}
                                        </pre>
                                    ) : (
                                        String(value)
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
