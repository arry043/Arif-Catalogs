import React from 'react';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import StatsPanel from './StatsPanel';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-primary-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/10 px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
              <span className="text-xl font-bold">A</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Arif <span className="text-primary-500">Catalog</span>
            </h1>
          </div>
          
          <div className="w-full md:w-96">
            <SearchBar />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        <StatsPanel />
        
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-28">
              <FilterPanel />
            </div>
          </aside>

          {/* Results Area */}
          <section className="flex-grow">
            {children}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/5 py-12 px-4 md:px-8 text-center text-slate-500 text-sm">
        <p>© 2026 Antigravity Systems. Built for Inflexa Solutions Assessment.</p>
      </footer>
    </div>
  );
};

export default Layout;
