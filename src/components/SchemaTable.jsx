import React from 'react';
import { Table, FileType, Info } from 'lucide-react';

export default function SchemaTable({ schema }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                <Table className="h-5 w-5 text-slate-500" />
                <h3 className="font-semibold text-slate-900">Definição do Schema</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-xs font-semibold border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3">Nome da Coluna</th>
                            <th className="px-6 py-3">Tipo</th>
                            <th className="px-6 py-3">Descrição</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {schema.map((col, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 font-mono text-blue-600 font-medium">{col.name}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-500 text-xs">
                                        {col.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{col.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
