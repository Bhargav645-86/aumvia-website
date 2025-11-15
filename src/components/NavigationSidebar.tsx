'use client';
import { useState } from 'react';
import Link from 'next/link';

interface NavigationSidebarProps {
  userRole: string;
  favorites: string[];
  setFavorites: (favorites: string[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredModules: string[];
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export default function NavigationSidebar({
  userRole,
  favorites,
  setFavorites,
  searchQuery,
  setSearchQuery,
  filteredModules,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: NavigationSidebarProps) {
  const [progress, setProgress] = useState({ compliance: 75, rota: 50 }); // Mock progress (replace with real data)

  // Role-based modules
  const roleModules = {
    business: ['compliance', 'hr', 'rota', 'inventory', 'marketplace', 'reports'],
    manager: ['hr', 'rota', 'inventory', 'reports'],
    staff: ['rota', 'marketplace'],
    jobseeker: ['marketplace', 'compliance'],
  };

  const availableModules = roleModules[userRole as keyof typeof roleModules] || [];

  const toggleFavorite = (module: string) => {
    setFavorites(favorites.includes(module) ? favorites.filter(f => f !== module) : [...favorites, module]);
  };

  return (
    <aside className={`bg-white rounded-xl shadow-lg p-4 w-full md:w-64 transition-transform ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
      <h2 className="text-xl font-bold text-indigo-700 mb-4">Navigation</h2>

      {/* Quick Search */}
      <input
        type="text"
        placeholder="Search modules..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500"
      />

      {/* Favorites */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-700 mb-2">Favorites</h3>
        <div className="space-y-2">
          {favorites.map((fav) => (
            <Link key={fav} href={`/${fav}`} className="block p-2 bg-indigo-100 rounded-lg hover:bg-indigo-200">
              {fav.charAt(0).toUpperCase() + fav.slice(1)}
            </Link>
          ))}
        </div>
      </div>

      {/* Context-Aware Menu */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-700 mb-2">Modules</h3>
        <ul className="space-y-2">
          {filteredModules.filter(m => availableModules.includes(m)).map((module) => (
            <li key={module} className="flex items-center justify-between">
              <Link href={`/${module}`} className="flex-1 p-2 rounded-lg hover:bg-gray-100">
                {module.charAt(0).toUpperCase() + module.slice(1)}
              </Link>
              <button onClick={() => toggleFavorite(module)} className="text-yellow-500 ml-2">
                {favorites.includes(module) ? '★' : '☆'}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Progress Tracking */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Progress</h3>
        {Object.entries(progress).map(([task, pct]) => (
          <div key={task} className="mb-2">
            <span className="text-sm">{task.charAt(0).toUpperCase() + task.slice(1)}</span>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}