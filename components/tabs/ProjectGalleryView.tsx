import React, { useState, useMemo } from 'react';
import { Project } from '../../types';

interface ProjectGalleryViewProps {
  projects: Project[];
  onSelectProject?: (project: Project) => void;
  onOpenCreation?: () => void;
  isEditor?: boolean;
}

const ProjectGalleryView: React.FC<ProjectGalleryViewProps> = ({ projects, onSelectProject, onOpenCreation, isEditor = false }) => {
  const [activeFilter, setActiveFilter] = useState('All Projects');
  const [searchQuery, setSearchQuery] = useState('');
  const filters = ['All Projects', 'Building Structures', 'Microcontrollers', 'Craft & Art', 'Robotics'];

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesCategory = activeFilter === 'All Projects' || project.category === activeFilter;
      const matchesSearch = 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        project.student.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeFilter, searchQuery, projects]);

  return (
    <div className="space-y-16 relative">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        <div className="max-w-xl">
          <div className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] inline-block mb-4">Global Discovery</div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">Innovation Library</h1>
          <p className="text-slate-400 text-lg font-medium">Explore the creative results of our global maker community.</p>
        </div>
        
        <div className="relative w-full lg:max-w-md">
          <div className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300">
            <i className="fa-solid fa-magnifying-glass text-lg"></i>
          </div>
          <input 
            type="text" 
            placeholder="Search projects or makers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f8f7ff] border border-slate-100 rounded-[2.5rem] pl-16 pr-8 py-6 text-sm font-bold focus:outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all placeholder:text-slate-300 shadow-inner"
          />
        </div>
      </header>

      {/* Categories Scroller */}
      <div className="flex flex-wrap gap-3 pb-4">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              activeFilter === f 
                ? 'bg-slate-950 text-white shadow-xl scale-105' 
                : 'bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredProjects.map(project => (
            <div 
              key={project.id} 
              onClick={() => onSelectProject?.(project)}
              className="bg-[#fcfcff] rounded-[4rem] border border-slate-100 shadow-sm hover:shadow-[0_40px_100px_rgba(99,102,241,0.06)] hover:-translate-y-4 transition-all duration-700 group cursor-pointer overflow-hidden p-4"
            >
              <div className="relative aspect-square rounded-[3.2rem] overflow-hidden mb-8 shadow-inner">
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-[2.5s] group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {project.award && (
                  <div className="absolute top-8 right-8 bg-[#ffde59] text-slate-900 px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl animate-float">
                    <i className="fa-solid fa-award"></i>
                    {project.award}
                  </div>
                )}
              </div>

              <div className="px-8 pb-10 space-y-6 text-center">
                <div className="flex items-center justify-center gap-4">
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">{project.category}</span>
                </div>

                <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">{project.title}</h3>
                
                <p className="text-sm text-slate-400 font-medium leading-relaxed line-clamp-2 px-4">
                  {project.description}
                </p>

                <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-xl ring-2 ring-indigo-50">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${project.student}`} className="w-full h-full object-cover" alt="" />
                     </div>
                     <div className="text-left">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Creator</p>
                       <p className="text-xs font-black text-slate-900">{project.student}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-2 bg-rose-50 text-rose-500 px-4 py-2 rounded-2xl text-[10px] font-black transition-all group-hover:bg-rose-500 group-hover:text-white">
                      <i className="fa-solid fa-heart"></i>
                      {project.likes}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-40 text-slate-300">
          <div className="w-32 h-32 rounded-[3rem] bg-slate-50 flex items-center justify-center mb-8 shadow-inner">
            <i className="fa-solid fa-compass text-5xl opacity-20"></i>
          </div>
          <p className="font-black text-lg uppercase tracking-widest text-slate-900">Nothing here yet</p>
          <p className="text-sm font-medium text-slate-400 mt-2">Try adjusting your filters or search query</p>
        </div>
      )}

      {/* Editor's Floating Action Button */}
      {isEditor && (
        <div className="fixed bottom-12 right-12 z-50">
          <button 
            onClick={onOpenCreation}
            className="w-20 h-20 rounded-[2.5rem] bg-slate-950 text-white text-2xl shadow-2xl hover:scale-110 hover:rotate-12 active:scale-95 transition-all duration-500"
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectGalleryView;