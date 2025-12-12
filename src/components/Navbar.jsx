import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Search } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <Database className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 tracking-tight">Catálogo de Dados</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Pesquisar dados..."
                                className="pl-9 pr-4 py-2 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 bg-slate-50"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
