import React, { useState, useMemo } from 'react';
import { Project, Lesson } from '../../types';
import { LESSONS } from '../../constants';

interface ProjectGalleryViewProps {
  projects: Project[];
  onSelectProject?: (project: Project) => void;
  onOpenCreation?: () => void;
  isEditor?: boolean;
}

const ProjectGalleryView: React.FC<ProjectGalleryViewProps> = ({ projects, onSelectProject, onOpenCreation, isEditor = false }) => {
  const [activeFilter, setActiveFilter] = useState('All Projects');
  const [searchQuery, setSearchQuery] = useState('');
  const filters = ['All Projects', 'Building Structures', 'Microcontrollers', 'Craft & Art', 'Robotics', '3D Printing Mastery'];

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
    <div className="space-y-10 relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Project Gallery</h1>
          <p className="text-slate-500 text-sm">Discover and learn from community submissions</p>
        </div>
        
        <div className="relative max-w-sm w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>
      </header>

      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === f 
                ? 'bg-purple-600 text-white' 
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <div 
              key={project.id} 
              onClick={() => onSelectProject?.(project)}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all group cursor-pointer"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={project.imageUrl || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800'} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                {project.award && (
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1.5 shadow-lg">
                    <i className="fa-solid fa-certificate"></i>
                    {project.award}
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-1">{project.title}</h3>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase mb-4 tracking-widest">
                  {project.student} | {project.grade}
                </div>
                <div className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black inline-block mb-4">
                  {project.category}
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8 line-clamp-2">
                  {project.description}
                </p>
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">View Workflow</span>
                  <i className="fa-solid fa-arrow-right text-slate-300 group-hover:text-purple-600 transition-colors"></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <i className="fa-solid fa-box-open text-4xl mb-4 opacity-20"></i>
          <p className="font-bold">No projects found in this category.</p>
        </div>
      )}

      {/* Floating Add Button - Editor Only */}
      {isEditor && (
        <div className="fixed bottom-24 right-6 z-50">
          <button 
            onClick={onOpenCreation}
            className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl shadow-2xl transition-all duration-300 active:scale-95 bg-gradient-to-tr from-indigo-600 to-purple-600 hover:rotate-90"
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectGalleryView;