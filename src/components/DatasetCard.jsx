import React from 'react';
import { Link } from 'react-router-dom';
import { Database, ArrowRight } from 'lucide-react';

export default function DatasetCard({ dataset }) {
    return (
        <Link
            to={`/dataset/${dataset.id}`}
            className="block group bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-50 p-3 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <Database className="h-6 w-6 text-blue-600" />
                </div>
                <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {dataset.category}
                </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                {dataset.title}
            </h3>

            <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                {dataset.description}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                <span className="text-xs text-slate-400">Proprietário: {dataset.owner}</span>
                <div className="flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Ver Dados <ArrowRight className="ml-1 h-4 w-4" />
                </div>
            </div>
        </Link>
    );
}
