
import React from 'react';
import { Lesson, Difficulty } from '../../types';

interface LabLayoutViewProps {
  onEnroll: (lesson: Lesson) => void;
  todayLessons: Lesson[];
  completedToday: string[];
  totalXP: number;
  productivity: number;
  streak: number; // New prop for login streaks
  activityLog?: any[];
  isEditor?: boolean;
}

const LabLayoutView: React.FC<LabLayoutViewProps> = ({ 
  onEnroll, 
  todayLessons, 
  completedToday, 
  productivity,
  streak,
  isEditor = false 
}) => {
  const stations = [
    { title: 'Craft & Play', subtitle: 'Analog Fabrication Station', color: 'bg-white', text: 'text-slate-900', icon: 'fa-shapes' },
    { title: 'Building Zone', subtitle: 'Structural Engineering Bay', color: 'bg-[#ede9fe]', text: 'text-[#8b5cf6]', icon: 'fa-wrench' },
    { title: 'Coding Lab', subtitle: 'Embedded Systems Workshop', color: 'bg-[#0f172a]', text: 'text-white', icon: 'fa-terminal' },
    { title: 'Robotics Lab', subtitle: 'Automation & Mechatronics', color: 'bg-[#f0fdf4]', text: 'text-[#22c55e]', icon: 'fa-robot' },
    { title: 'Digital Fab', subtitle: '3D Printing & Laser Cutting', color: 'bg-[#fde68a]', text: 'text-[#b45309]', icon: 'fa-cubes' },
    { title: 'Expo Hall', subtitle: 'Presentation & Showcase', color: 'bg-[#fda4af]', text: 'text-[#be123c]', icon: 'fa-lightbulb' }
  ];

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case Difficulty.BEGINNER: return 'text-emerald-500 bg-emerald-50';
      case Difficulty.INTERMEDIATE: return 'text-indigo-500 bg-indigo-50';
      case Difficulty.HARD: return 'text-rose-500 bg-rose-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  return (
    <div className="space-y-24">
      {/* Top Section: Hero + Progress Card */}
      <div className="grid lg:grid-cols-12 gap-16 items-center">
        {/* Left: Learning Progress Card */}
        <div className="lg:col-span-4 bg-[#6366f1] rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-8 right-10 opacity-30 group-hover:scale-110 transition-transform">
             <i className="fa-solid fa-ellipsis text-lg"></i>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-8">Learning Progress</h2>
          
          <div className="grid grid-cols-3 gap-3 mb-12">
            {[
              { label: 'Streaks', val: `${streak} Days`, icon: 'fa-fire' },
              { label: 'Productivity', val: `${productivity}%`, icon: productivity === 100 ? 'fa-circle-check' : 'fa-bolt' },
              { label: 'Success', val: '80%', icon: 'fa-trophy' }
            ].map(stat => (
              <div key={stat.label} className={`bg-white/10 rounded-3xl p-4 flex flex-col items-center justify-center text-center gap-2 border border-white/5 transition-all ${stat.label === 'Productivity' && productivity === 100 ? 'bg-emerald-500/20 border-emerald-400/30' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${stat.label === 'Productivity' && productivity === 100 ? 'bg-emerald-400 text-emerald-900' : 'bg-white/10 text-white'} ${stat.label === 'Streaks' ? 'text-orange-400' : ''}`}>
                  <i className={`fa-solid ${stat.icon} text-[10px]`}></i>
                </div>
                <span className="text-[8px] font-bold text-white/60 uppercase tracking-widest leading-none">{stat.label}</span>
                <span className="text-[11px] font-black tracking-tight">{stat.val}</span>
              </div>
            ))}
          </div>

          <div className="bg-white/5 rounded-[2.5rem] p-6 border border-white/10">
             <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/50">Target Achievement</span>
                <div className="flex items-end gap-1.5 h-6">
                   {[4, 7, 5, 8, 3, 6, 9].map((h, i) => (
                     <div key={i} className={`w-1 rounded-full ${i < (productivity / 14) ? 'bg-emerald-400' : 'bg-white/20'}`} style={{ height: `${h * 10}%` }}></div>
                   ))}
                </div>
             </div>
             <div className="text-xs font-black">{productivity}% Pathway Complete</div>
          </div>
        </div>

        {/* Right: Content Hero */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center gap-4">
            <span className="w-10 h-1 bg-[#6366f1] rounded-full"></span>
            <span className="text-[11px] font-black text-[#6366f1] uppercase tracking-[0.4em]">Build Mode Activation</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.05]">
            Your Space for <span className="text-[#6366f1]">Digital<br />Fabrication.</span>
          </h1>
          <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-xl">
            Explore the specialized activity zones of Design Maker Lab. Each station is equipped with industry-standard tools for your next breakthrough.
          </p>
        </div>
      </div>

      {/* Grid Section (Stations) */}
      <div className="bg-white rounded-[4rem] p-12 border border-slate-100 relative shadow-sm">
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none"></div>
        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          {stations.map(station => (
            <div key={station.title} className={`${station.color} rounded-[3rem] p-10 flex flex-col items-center justify-center text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group cursor-pointer border border-slate-100/10 min-h-[240px]`}>
               <div className={`w-16 h-16 rounded-full bg-slate-400/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <i className={`fa-solid ${station.icon} ${station.text} text-2xl`}></i>
               </div>
               <h3 className={`text-xl font-black ${station.text} tracking-tight uppercase leading-none mb-2`}>{station.title}</h3>
               <p className={`text-[9px] font-black ${station.text} opacity-50 uppercase tracking-widest`}>{station.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Lessons Section */}
      <section className="space-y-12">
        <div className="flex items-end justify-between border-b border-slate-100 pb-8">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-[#6366f1] uppercase tracking-[0.3em]">Active Pathways</span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Agenda for Today</h2>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Finished</span>
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#6366f1]"></div> Available</span>
          </div>
        </div>

        {todayLessons.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10">
            {todayLessons.map((lesson) => {
              const isCompleted = completedToday.includes(lesson.id);
              return (
                <div 
                  key={lesson.id} 
                  onClick={() => !isCompleted && onEnroll(lesson)}
                  className={`bg-white border border-slate-100 rounded-[3.8rem] p-6 shadow-sm hover:shadow-2xl transition-all duration-500 group relative flex flex-col ${isCompleted ? 'bg-slate-50 border-emerald-100 opacity-80' : 'hover:-translate-y-2'} ${!isCompleted ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div className="relative aspect-[16/10] rounded-[3.2rem] overflow-hidden mb-8 shadow-inner">
                    <img src={lesson.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]" alt="" />
                    {isCompleted && (
                      <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[2px] flex items-center justify-center">
                         <div className="w-16 h-16 rounded-full bg-white text-emerald-500 flex items-center justify-center text-2xl shadow-2xl animate-in zoom-in duration-500 border-4 border-emerald-50">
                           <i className="fa-solid fa-check"></i>
                         </div>
                      </div>
                    )}
                    <div className={`absolute bottom-6 left-6 px-4 py-2 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl ${getDifficultyColor(lesson.difficulty)}`}>
                      {lesson.difficulty}
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col px-4">
                    <div className="flex items-center justify-between mb-3">
                       <span className="text-[10px] font-black text-[#6366f1] uppercase tracking-[0.3em]">{lesson.category}</span>
                       <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{lesson.duration}</span>
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-[#6366f1] transition-colors mb-4">{lesson.title}</h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-2 mb-8">{lesson.description}</p>
                    
                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <i className={`fa-solid ${isCompleted ? 'fa-circle-check text-emerald-500' : 'fa-circle-play text-indigo-400'} text-[10px]`}></i>
                          <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{isCompleted ? 'Completed' : 'Initiate Session'}</span>
                       </div>
                       {!isCompleted && (
                         <div className="w-10 h-10 rounded-2xl bg-[#6366f1] text-white flex items-center justify-center text-xs group-hover:scale-110 transition-transform shadow-lg">
                           <i className="fa-solid fa-arrow-right"></i>
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-slate-300 border-4 border-dashed border-slate-100 rounded-[4rem] bg-slate-50/20">
             <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm mb-6 opacity-40">
               <i className="fa-solid fa-calendar-xmark text-3xl"></i>
             </div>
             <p className="font-black text-xl uppercase tracking-[0.2em] text-slate-400">Lab Open: No Scheduled Workshops</p>
             <p className="text-sm font-medium mt-2">Check the monthly calendar or work on your independent projects.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default LabLayoutView;
