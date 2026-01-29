import React, { useState, useMemo } from 'react';
import { Lesson, Difficulty } from '../../types';

interface LabLayoutViewProps {
  onEnroll: (lesson: Lesson) => void;
  todayLessons: Lesson[];
  completedToday: string[];
  totalXP: number;
}

const LabLayoutView: React.FC<LabLayoutViewProps> = ({ onEnroll, todayLessons, completedToday, totalXP }) => {
  const [enrollStatus, setEnrollStatus] = useState<'idle' | 'processing' | 'enrolled'>('idle');

  // Calculate dynamic productivity percentage
  const productivity = useMemo(() => {
    if (todayLessons.length === 0) return 0;
    const countCompleted = todayLessons.filter(l => completedToday.includes(l.id)).length;
    return Math.round((countCompleted / todayLessons.length) * 100);
  }, [todayLessons, completedToday]);

  // Calculate overall success based on current session completions
  const successRate = useMemo(() => {
    if (todayLessons.length === 0) return 0;
    // Just for the dashboard vibe, mapping it similarly
    return 80 + (completedToday.length * 5); // Base 80% plus bonus for each completion
  }, [todayLessons, completedToday]);

  const handleEnrollClick = (lesson: Lesson) => {
    setEnrollStatus('processing');
    setTimeout(() => {
      setEnrollStatus('enrolled');
      setTimeout(() => {
        onEnroll(lesson);
        setEnrollStatus('idle');
      }, 1200);
    }, 1500);
  };

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
      {/* Learning Progress Header Widget Area */}
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 bg-indigo-600 rounded-[3.5rem] p-10 text-white shadow-2xl shadow-indigo-100 flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black tracking-tight leading-none">Learning Progress</h2>
              <i className="fa-solid fa-ellipsis text-white/40"></i>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-10">
               {[
                 { label: 'Total time', value: '34h 43m', icon: 'fa-clock', color: 'bg-white/10' },
                 { label: 'Productivity', value: `${productivity}%`, icon: 'fa-bolt', color: 'bg-white/10' },
                 { label: 'Success', value: `${Math.min(100, successRate)}%`, icon: 'fa-chart-pie', color: 'bg-white/10' }
               ].map((stat, i) => (
                 <div key={i} className={`${stat.color} rounded-3xl p-4 flex flex-col items-center justify-center text-center gap-2 border border-white/5 hover:bg-white/20 transition-all cursor-default`}>
                   <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs">
                     <i className={`fa-solid ${stat.icon}`}></i>
                   </div>
                   <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">{stat.label}</span>
                   <span className="text-sm font-black">{stat.value}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-white/10 p-5 rounded-3xl flex items-center justify-between border border-white/10 relative z-10">
             <div>
               <p className="text-[10px] font-black uppercase text-white/50 mb-1 tracking-widest">Weekly Target</p>
               <h4 className="text-sm font-black">{totalXP.toLocaleString()} XP Gained</h4>
             </div>
             <div className="flex gap-1 items-end h-10">
                {[4, 8, 3, 7, 5, 9, 6].map((h, i) => (
                  <div key={i} className={`w-1.5 rounded-full transition-all duration-1000 ${totalXP > 0 ? 'bg-[#ffde59]' : 'bg-white/20'}`} style={{ height: `${h * 10}%` }}></div>
                ))}
             </div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col justify-center gap-6">
          <div className="flex items-center gap-4 mb-2">
            <span className="w-12 h-1 bg-indigo-600 rounded-full"></span>
            <span className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.4em]">Build Mode Activation</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Your Space for <span className="text-indigo-600">Digital Fabrication.</span>
          </h1>
          <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-2xl">
            Explore the specialized activity zones of Design Maker Lab. Each station is equipped with industry-standard tools for your next breakthrough.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 mt-4">
             <button 
               onClick={() => todayLessons[0] && handleEnrollClick(todayLessons[0])}
               disabled={todayLessons.length === 0 || enrollStatus !== 'idle'}
               className={`px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all shadow-2xl flex items-center gap-4 active:scale-95 ${
                 todayLessons.length === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' :
                 enrollStatus === 'enrolled' ? 'bg-emerald-500 text-white' : 'bg-[#ffde59] text-slate-900 shadow-[#ffde59]/20'
               }`}
             >
               {enrollStatus === 'idle' ? (
                 <>
                   <i className="fa-solid fa-graduation-cap"></i>
                   {todayLessons.length > 0 ? 'Initialize Training' : 'No Lessons Today'}
                 </>
               ) : enrollStatus === 'processing' ? (
                 <i className="fa-solid fa-spinner animate-spin"></i>
               ) : (
                 <>
                   <i className="fa-solid fa-check"></i>
                   Access Granted
                 </>
               )}
             </button>
             <button className="px-8 py-5 rounded-full bg-slate-50 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:text-slate-900 hover:bg-slate-100 transition-all">
               Tour Workspace
             </button>
          </div>
        </div>
      </div>

      {/* Grid Floor Plan / Activity Stations */}
      <div className="bg-[#f8f7ff] rounded-[4rem] p-12 border border-slate-100/50 shadow-inner relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1000 1000">
            <path d="M100 100 L900 100 L900 900 L100 900 Z" fill="none" stroke="currentColor" strokeWidth="1" className="text-indigo-950" />
            <path d="M500 0 L500 1000" stroke="currentColor" strokeWidth="0.5" className="text-indigo-950" />
            <path d="M0 500 L1000 500" stroke="currentColor" strokeWidth="0.5" className="text-indigo-950" />
            <circle cx="500" cy="500" r="150" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5" className="text-indigo-400" />
          </svg>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 relative z-10">
          {[
            { id: 'craft', label: 'Craft & Play', icon: 'fa-hammer', desc: 'Analog fabrication station', color: 'bg-white text-slate-900' },
            { id: 'build', label: 'Building Zone', icon: 'fa-cube', desc: 'Structural engineering bay', color: 'bg-[#ede9ff] text-indigo-600' },
            { id: 'code', label: 'Coding Lab', icon: 'fa-terminal', desc: 'Embedded systems workshop', color: 'bg-slate-900 text-white' },
            { id: 'robot', label: 'Robotics Lab', icon: 'fa-robot', desc: 'Automation & Mechatronics', color: 'bg-white text-emerald-500 border border-emerald-50 shadow-sm' },
            { id: 'fab', label: 'Digital Fab', icon: 'fa-print', desc: '3D Printing & Laser cutting', color: 'bg-[#ffde59] text-slate-900' },
            { id: 'expo', label: 'Expo Hall', icon: 'fa-lightbulb', desc: 'Presentation & Showcase', color: 'bg-[#ff7a7a] text-white shadow-xl shadow-rose-200/20' }
          ].map((zone) => (
            <div 
              key={zone.id} 
              className={`${zone.color} rounded-[3.5rem] p-10 flex flex-col items-center justify-center text-center shadow-xl hover:-translate-y-3 transition-all duration-700 cursor-pointer group relative overflow-hidden`}
            >
              <div className="w-20 h-20 rounded-full bg-current opacity-5 mb-6 absolute scale-0 group-hover:scale-[3] transition-transform duration-1000"></div>
              <div className={`w-16 h-16 rounded-3xl mb-6 flex items-center justify-center text-3xl shadow-sm transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 ${zone.id === 'expo' ? 'bg-white/20' : 'bg-current opacity-20'}`}>
                <i className={`fa-solid ${zone.icon} relative text-current`}></i>
              </div>
              <h3 className="text-lg font-black uppercase tracking-[0.1em] mb-2 leading-none relative z-10">{zone.label}</h3>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-40 relative z-10">{zone.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pathways / Lessons section - Renewed Each Day Based on Schedule */}
      <div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] inline-block mb-4">Today's Enrolled Lessons</div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Active Learning Pathways</h2>
          </div>
          <div className="flex gap-2 p-1.5 bg-slate-100 rounded-full">
             <button className="px-6 py-3 bg-white shadow-sm rounded-full text-[10px] font-black uppercase tracking-widest">Today Only</button>
             <button className="px-6 py-3 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">Full Catalog</button>
          </div>
        </div>
        
        {todayLessons.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-10">
            {todayLessons.map((lesson, idx) => {
              const isCompleted = completedToday.includes(lesson.id);
              return (
                <div 
                  key={lesson.id} 
                  onClick={() => !isCompleted && onEnroll(lesson)}
                  className={`bg-white border border-slate-100 rounded-[3.8rem] p-5 pb-14 shadow-sm hover:shadow-2xl hover:-translate-y-4 transition-all duration-700 group cursor-pointer relative ${isCompleted ? 'opacity-70 grayscale-[0.5]' : ''}`}
                >
                  <div className="relative aspect-[16/11] rounded-[3.2rem] overflow-hidden mb-8 shadow-inner border-2 border-slate-50">
                    <img src={lesson.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2.5s]" alt="" />
                    <div className="absolute top-6 left-6 w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl flex items-center justify-center font-black text-slate-900 text-sm">
                      {idx + 1}
                    </div>
                    {isCompleted && (
                      <div className="absolute inset-0 bg-indigo-600/20 backdrop-blur-[2px] flex items-center justify-center">
                         <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center text-3xl shadow-2xl border-4 border-white animate-in zoom-in duration-500">
                           <i className="fa-solid fa-check"></i>
                         </div>
                      </div>
                    )}
                    <div className={`absolute bottom-6 left-6 px-4 py-2 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl ${getDifficultyColor(lesson.difficulty)}`}>
                      {lesson.difficulty}
                    </div>
                  </div>
                  
                  <div className="px-6 space-y-4 text-center">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">{lesson.category}</span>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">{lesson.title}</h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-2 pb-6 border-b border-slate-50">
                      {lesson.description}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-colors">
                           <i className="fa-solid fa-star text-[10px]"></i>
                         </div>
                         <span className="text-[11px] font-black text-slate-800">{isCompleted ? '50 XP Awarded' : '50 XP Reward'}</span>
                       </div>
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-[#ede9ff] text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                         <i className={`fa-solid ${isCompleted ? 'fa-check-double' : 'fa-chevron-right'} text-xs`}></i>
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-300 border-4 border-dashed border-slate-50 rounded-[4rem]">
             <i className="fa-solid fa-calendar-xmark text-6xl mb-6 opacity-20"></i>
             <p className="font-black text-xl uppercase tracking-widest text-slate-400">No Lessons Scheduled for Today</p>
             <p className="text-sm font-medium text-slate-400 mt-2">Check the 'Schedule' tab to see when the next workshop is active.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabLayoutView;