
import React, { useState, useMemo } from 'react';
import { Material } from '../../types';
import MaterialCreationModal from '../MaterialCreationModal';

interface MaterialsViewProps {
  materials: Material[];
  onAddMaterial: (material: Material) => void;
}

const MaterialsView: React.FC<MaterialsViewProps> = ({ materials, onAddMaterial }) => {
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedInterests, setSavedInterests] = useState<string[]>([]); // Array of material IDs
  const [isCreatingMaterial, setIsCreatingMaterial] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const categories = ['All Products', '3D Printer', 'Coding', 'Accessories', 'Filament', 'Robotics'];

  const filteredMaterials = useMemo(() => {
    return materials.filter(item => {
      const matchesCategory = activeCategory === 'All Products' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [materials, activeCategory, searchQuery]);

  const savedItems = useMemo(() => {
    return materials.filter(m => savedInterests.includes(m.id));
  }, [materials, savedInterests]);

  const handleProductClick = (url: string) => {
    if (!url || url === '#') return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (savedInterests.includes(id)) {
      setSavedInterests(savedInterests.filter(i => i !== id));
    } else {
      setSavedInterests([...savedInterests, id]);
    }
  };

  return (
    <div className="flex flex-col gap-8 bg-white -m-8 md:-m-12 p-8 md:p-12 font-sans min-h-screen relative overflow-x-hidden">
      {/* Refined Header with Dominant Search */}
      <header className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-slate-900 text-4xl font-black tracking-tight leading-none">Project Toolkit</h1>
            <p className="text-slate-400 text-sm font-medium">Equip your laboratory with professional-grade hardware</p>
          </div>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="group relative flex items-center justify-center w-14 h-14 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-rose-200 hover:bg-rose-50 transition-all duration-300"
          >
            <i className="fa-solid fa-heart text-xl text-slate-300 group-hover:text-rose-500 transition-colors"></i>
            {savedInterests.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center font-black border-4 border-white shadow-lg animate-in zoom-in duration-300">
                {savedInterests.length}
              </span>
            )}
          </button>
        </div>

        {/* Global Search Bar - Now Full Width and More Dominant */}
        <div className="relative w-full">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">
            <i className="fa-solid fa-magnifying-glass text-lg"></i>
          </div>
          <input 
            type="text" 
            placeholder="Search catalog... find a product, tool, or material" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-50 rounded-[2rem] pl-16 pr-32 py-6 text-base text-slate-800 focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:bg-white focus:border-blue-100 transition-all placeholder:text-slate-400 font-medium"
          />
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-4">
            <div className="h-4 w-px bg-slate-200"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filteredMaterials.length} results</span>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-12 pt-4">
        {/* Sidebar Categories */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-12 space-y-10">
            <section>
              <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-900 mb-8 flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                Filter Lab
              </h3>
              <ul className="space-y-2">
                {categories.map(cat => (
                  <li key={cat}>
                    <button 
                      onClick={() => setActiveCategory(cat)}
                      className={`w-full text-left px-5 py-3.5 rounded-2xl text-[13px] font-black transition-all flex items-center justify-between group ${
                        activeCategory === cat 
                          ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 scale-105' 
                          : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                      <i className={`fa-solid fa-chevron-right text-[8px] transition-transform ${activeCategory === cat ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`}></i>
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
              <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                Don't see what you need? Add a custom item using the floating tool below.
              </p>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1 pb-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-20">
            {filteredMaterials.map(item => (
              <div key={item.id} className="group flex flex-col gap-6">
                {/* Image Container */}
                <div 
                  className="relative aspect-square bg-white border border-slate-100 rounded-[3rem] p-12 flex items-center justify-center cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                  onClick={() => handleProductClick(item.externalUrl)}
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Visit Store Label on Hover */}
                  <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[3rem] backdrop-blur-[2px]">
                    <div className="bg-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-900 border border-slate-200 shadow-2xl flex items-center gap-2">
                      Check Specs
                      <i className="fa-solid fa-arrow-up-right-from-square text-[8px]"></i>
                    </div>
                  </div>
                </div>

                {/* Meta Information Area */}
                <div className="flex flex-col gap-2 px-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-blue-600 uppercase font-black tracking-[0.25em]">{item.category}</span>
                    <button 
                      onClick={(e) => toggleLike(e, item.id)}
                      className={`text-lg transition-all active:scale-75 ${
                        savedInterests.includes(item.id) ? 'text-rose-500' : 'text-slate-200 hover:text-rose-400'
                      }`}
                    >
                      <i className={`fa-solid fa-heart ${savedInterests.includes(item.id) ? 'animate-celebrate' : ''}`}></i>
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => handleProductClick(item.externalUrl)}
                    className="text-lg font-black text-slate-900 leading-tight text-left hover:text-blue-600 transition-colors line-clamp-2"
                  >
                    {item.name}
                  </button>
                  
                  <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredMaterials.length === 0 && (
            <div className="flex flex-col items-center justify-center py-40 text-slate-300">
              <i className="fa-solid fa-binoculars text-6xl mb-8 opacity-20"></i>
              <p className="font-black text-slate-900 uppercase tracking-widest">No matching gear</p>
              <p className="text-sm font-medium text-slate-400 mt-2">Adjust your filters or try a broader search</p>
            </div>
          )}
        </main>
      </div>

      {/* Floating Add Product Button */}
      <div className="fixed bottom-24 right-10 z-[100]">
        <button 
          onClick={() => setIsCreatingMaterial(true)}
          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-all duration-300 active:scale-90 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:rotate-90"
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      {/* Saved Interests Cart (Drawer Style) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[150] flex justify-end">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setIsCartOpen(false)}
          ></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 border-l border-slate-100">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Saved Interests</h2>
                <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest mt-1">Review your lab wishlist</p>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {savedItems.length > 0 ? (
                savedItems.map(item => (
                  <div key={item.id} className="group flex gap-5 p-5 rounded-3xl border border-slate-100 hover:border-blue-100 hover:bg-slate-50/50 transition-all">
                    <div className="w-20 h-20 bg-white rounded-2xl border border-slate-100 p-2 flex items-center justify-center shrink-0">
                      <img src={item.imageUrl} className="w-full h-full object-contain" alt="" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="font-black text-slate-900 text-sm leading-tight">{item.name}</h4>
                      <div className="flex items-center gap-3 mt-2">
                        <button 
                          onClick={() => handleProductClick(item.externalUrl)}
                          className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                        >
                          View Official
                        </button>
                        <button 
                          onClick={(e) => toggleLike(e, item.id)}
                          className="text-[10px] font-black text-rose-400 uppercase tracking-widest hover:text-rose-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-slate-300 space-y-4">
                  <i className="fa-solid fa-heart-crack text-5xl opacity-10"></i>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your wishlist is empty</p>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-slate-100 space-y-4">
              <button 
                onClick={() => handleProductClick("https://www.eptecstore.com/")}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3"
              >
                Visit Official Partner Store
                <i className="fa-solid fa-external-link text-[10px]"></i>
              </button>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-colors"
              >
                Back to Catalog
              </button>
            </div>
          </div>
        </div>
      )}

      {isCreatingMaterial && (
        <MaterialCreationModal 
          onClose={() => setIsCreatingMaterial(false)}
          onSubmit={(mat) => {
            onAddMaterial(mat);
            setIsCreatingMaterial(false);
          }}
        />
      )}
    </div>
  );
};

export default MaterialsView;
