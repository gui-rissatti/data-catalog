import React from 'react';
import { ArrowRight, Database, CheckCircle, ShieldCheck, Trophy, Layers } from 'lucide-react';

export default function DataLineage({ currentLayer, title }) {
    const layers = [
        { name: 'Bronze', icon: Database, color: 'text-orange-600', bg: 'bg-orange-100', desc: 'Raw Ingestion' },
        { name: 'Silver', icon: ShieldCheck, color: 'text-slate-600', bg: 'bg-slate-200', desc: 'Cleaned & Enriched' },
        { name: 'Gold', icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-100', desc: 'Aggregated & Ready' }
    ];

    // Determine active index based on current layer
    const activeIndex = layers.findIndex(l => l.name.toLowerCase() === (currentLayer || '').toLowerCase());
    const safeIndex = activeIndex === -1 ? 0 : activeIndex; // Default to Bronze if unknown

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-6">
                <Layers className="h-4 w-4 text-slate-500" /> Data Lineage
            </h3>

            <div className="relative pl-4 border-l-2 border-slate-100 space-y-8">
                {layers.map((layer, idx) => {
                    const isActive = idx === safeIndex;
                    const isPast = idx < safeIndex;
                    const Icon = layer.icon;

                    return (
                        <div key={layer.name} className={`relative flex items-start gap-4 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                            {/* Dot on timeline */}
                            <div className={`absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-white ring-1 ring-slate-200 ${isActive ? 'bg-blue-600 ring-blue-200 scale-125' : 'bg-slate-300'}`}></div>

                            <div className={`mt-0.5 p-2 rounded-lg ${layer.bg}`}>
                                <Icon className={`h-5 w-5 ${layer.color}`} />
                            </div>

                            <div>
                                <h4 className={`text-sm font-bold ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                                    {layer.name} Layer
                                    {isActive && <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Current</span>}
                                </h4>
                                <p className="text-xs text-slate-500">{layer.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 text-xs text-center text-slate-400">
                This dataset is in the <strong>{currentLayer || 'Bronze'}</strong> layer of the Medallion Architecture.
            </div>
        </div>
    );
}
