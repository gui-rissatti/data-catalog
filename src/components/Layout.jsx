import React from 'react';
import Navbar from './Navbar';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
            <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
                    <p>© 2023 Corporate Data Catalog. Internal Use Only.</p>
                </div>
            </footer>
        </div>
    );
}
