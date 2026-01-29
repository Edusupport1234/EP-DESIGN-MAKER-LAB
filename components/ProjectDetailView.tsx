import React, { useState } from 'react';
import { Project } from '../types';

interface ProjectDetailViewProps {
  project: Project;
  onExit: () => void;
  onRemoveStep?: (index: number) => void;
  isEditor?: boolean;
  isLiked?: boolean;
  onToggleLike?: () => void;
}

const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ 
  project, 
  onExit, 
  onRemoveStep, 
  isEditor = false,
  isLiked = false,
  onToggleLike
}) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!project) return null;

  const handleRemove = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (onRemoveStep) {
      onRemoveStep(index);
      // Adjust active step if needed
      if (activeStep >= (project.steps?.length || 0) - 1) {
        setActiveStep(Math.max(0, index - 1));
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#fcfcfd] text-slate-800 min-h-[700px]">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200/60 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-6">
          <button 
            onClick={onExit} 
            className="w-10 h-10 rounded-xl hover:bg-slate-50 border border-slate-100 flex items-center justify-center transition-all text-slate-400 hover:text-slate-900 shadow-sm"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-black uppercase tracking-widest">STUDENT PROJECT</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{project.category}</span>
            </div>
            <h2 className="text-sm font-black text-slate-900">Created by {project.student} ({project.grade})</h2>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={onToggleLike}
             className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm ${
               isLiked 
                 ? 'bg-rose-500 text-white hover:bg-rose-600' 
                 : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
             }`}
           >
             <i className={`fa-solid fa-heart ${isLiked ? 'animate-bounce' : ''}`}></i>
             {project.likes} Likes
           </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Build Steps */}
        <div className="w-72 border-r border-slate-200/60 bg-white hidden lg:flex flex-col p-6 overflow-y-auto shrink-0">
          <h3 className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] mb-6 px-2">Build Process</h3>
          <ul className="space-y-2">
            {project.steps?.map((step, i) => (
              <li key={i} className="group/item relative">
                <button 
                  onClick={() => setActiveStep(i)}
                  className={`w-full text-left p-3.5 rounded-2xl text-[13px] font-bold flex items-center gap-4 transition-all group border-2 pr-10 ${
                    activeStep === i 
                      ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-md shadow-blue-100' 
                      : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    activeStep === i ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                  }`}>
                    <i className={`fa-solid ${step.icon} text-[12px]`}></i>
                  </div>
                  <span className="truncate">{step.title}</span>
                </button>
                {isEditor && (
                  <button 
                    onClick={(e) => handleRemove(e, i)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-rose-50 text-rose-400 opacity-0 group-hover/item:opacity-100 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                    title="Remove this step"
                  >
                    <i className="fa-solid fa-minus text-[10px]"></i>
                  </button>
                )}
              </li>
            ))}
            {(!project.steps || project.steps.length === 0) && (
              <p className="text-[10px] text-slate-400 text-center py-4 font-bold uppercase">No steps remaining</p>
            )}
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-[#fcfcfd] scroll-smooth custom-scrollbar">
          <div className="max-w-4xl mx-auto px-6 md:px-12 py-10 space-y-16 pb-32">
            
            {/* 1. BIG PICTURE */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                  {project.title}
                </h1>
                {project.award && (
                  <div className="bg-amber-400 text-white px-6 py-3 rounded-2xl text-xs font-black shadow-lg shadow-amber-100 animate-bounce flex items-center gap-2">
                    <i className="fa-solid fa-trophy"></i>
                    {project.award}
                  </div>
                )}
              </div>
              <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                <img src={project.imageUrl} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
            </div>

            {/* 2. DESCRIPTION */}
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <i className="fa-solid fa-quote-right text-6xl"></i>
              </div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">The Student Story</h3>
              <p className="text-xl md:text-2xl font-medium leading-relaxed italic">
                "{project.fullDescription || project.description}"
              </p>
            </div>

            {/* 3. HARDWARE/MATERIALS */}
            {project.materials && project.materials.length > 0 && (
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-slate-100 space-y-8">
                <h2 className="text-2xl font-black flex items-center gap-3">
                  <i className="fa-solid fa-toolbox text-blue-500"></i>
                  Materials & Tech Used
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.materials.map((mat, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                      {mat.icon ? (
                        <img src={mat.icon} className="w-10 h-10 rounded-lg object-cover" alt="" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-300">
                          <i className="fa-solid fa-cube text-xs"></i>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-slate-800">{mat.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Quantity: {mat.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. EXECUTION STEPS */}
            {project.steps && project.steps.length > 0 && (
              <div className="space-y-8">
                <h2 className="text-2xl font-black">Building Documentation</h2>
                <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-200/60 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                        <i className={`fa-solid ${project.steps[activeStep].icon} text-2xl`}></i>
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 leading-none mb-1">{project.steps[activeStep].title}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Step {activeStep + 1} of {project.steps.length}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                        disabled={activeStep === 0}
                        className="w-12 h-12 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-20"
                      >
                        <i className="fa-solid fa-chevron-left"></i>
                      </button>
                      <button 
                        onClick={() => setActiveStep(prev => Math.min(project.steps!.length - 1, prev + 1))}
                        disabled={activeStep === project.steps.length - 1}
                        className="w-12 h-12 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-20"
                      >
                        <i className="fa-solid fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>

                  <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-medium">
                    {project.steps[activeStep].content}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailView;