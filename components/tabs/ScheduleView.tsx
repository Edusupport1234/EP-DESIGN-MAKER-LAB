
import React, { useState } from 'react';
import { DaySchedule, ScheduleItem, Project } from '../../types';
import ScheduleCreationModal from '../ScheduleCreationModal';

interface ScheduleViewProps {
  schedule: DaySchedule[];
  projects: Project[];
  onAddItem: (day: string, item: ScheduleItem) => void;
  isEditor?: boolean;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ schedule, projects, onAddItem, isEditor = false }) => {
  const [selectedPreview, setSelectedPreview] = useState<ScheduleItem | null>(null);
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('All');
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);

  const activityTypes = [
    { label: 'Recess Time', icon: 'fa-box-open', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', activeColor: 'ring-2 ring-emerald-500 bg-emerald-100' },
    { label: 'CCA', icon: 'fa-users', color: 'bg-blue-50 text-blue-600 border-blue-200', activeColor: 'ring-2 ring-blue-500 bg-blue-100' },
    { label: 'Workshop', icon: 'fa-wand-magic-sparkles', color: 'bg-purple-50 text-purple-600 border-purple-200', activeColor: 'ring-2 ring-purple-500 bg-purple-100' },
    { label: 'Competition', icon: 'fa-trophy', color: 'bg-orange-50 text-orange-600 border-orange-200', activeColor: 'ring-2 ring-orange-500 bg-orange-100' },
    { label: 'Exhibition', icon: 'fa-palette', color: 'bg-pink-50 text-pink-600 border-pink-200', activeColor: 'ring-2 ring-pink-500 bg-pink-100' }
  ];

  const handleFilterToggle = (label: string) => {
    setActiveTypeFilter(prev => prev === label ? 'All' : label);
  };

  return (
    <div className="space-y-10 relative">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Customer Lesson Schedule</h1>
          <p className="text-slate-500 text-sm">Daily guided lesson plans for our product owners and subscribers</p>
        </div>
        <button 
          onClick={() => setActiveTypeFilter('All')}
          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTypeFilter === 'All' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
          }`}
        >
          Reset Filters
        </button>
      </header>

      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
        <div className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-6">Filter by Program Type:</div>
        <div className="flex flex-wrap gap-3">
          {activityTypes.map(type => (
            <button 
              key={type.label} 
              onClick={() => handleFilterToggle(type.label)}
              className={`px-6 py-3 rounded-2xl text-[11px] font-bold flex items-center gap-3 border transition-all active:scale-95 ${
                activeTypeFilter === type.label 
                  ? type.activeColor + ' shadow-md scale-105' 
                  : type.color + ' opacity-60 hover:opacity-100 border-transparent'
              }`}
            >
              <i className={`fa-solid ${type.icon}`}></i>
              {type.label === 'Recess Time' ? 'Customer Support' : type.label}
              {activeTypeFilter === type.label && (
                <span className="relative flex h-2 w-2 ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-calendar-week text-purple-500"></i>
            <h2 className="text-xl font-bold text-slate-800">
              {activeTypeFilter === 'All' ? 'Weekly Learning Path' : `${activeTypeFilter} Schedule`}
            </h2>
          </div>
          <div className="text-xs font-bold text-emerald-600 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Support Active
          </div>
        </div>

        {schedule.map(day => {
          const filteredItems = day.items.filter(item => 
            activeTypeFilter === 'All' || item.type === activeTypeFilter
          );

          return (
            <div key={day.day} className="bg-white border-2 border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:border-purple-100 transition-colors group">
              <div className="bg-slate-50 p-4 px-8 border-b border-slate-100 text-slate-900 font-black text-xs uppercase tracking-widest flex items-center justify-between group-hover:bg-purple-50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-purple-600">{day.day}</span>
                  <span className="text-slate-300 font-medium lowercase first-letter:uppercase tracking-normal">({day.date})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-white px-2 py-0.5 rounded-full border border-slate-200 text-[9px] text-slate-400">
                    {filteredItems.length} {filteredItems.length === 1 ? 'Activity' : 'Activities'}
                  </span>
                </div>
              </div>
              <div className="p-8 space-y-6">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, idx) => {
                    const typeStyle = activityTypes.find(t => t.label === item.type)?.color || '';
                    return (
                      <div key={idx} className={`p-8 rounded-[2rem] border flex flex-col gap-4 relative hover:scale-[1.01] transition-transform ${typeStyle} shadow-sm`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center text-lg">
                              <i className={`fa-solid ${activityTypes.find(t => t.label === item.type)?.icon}`}></i>
                            </div>
                            <div>
                              <h3 className="text-lg font-black">{item.title}</h3>
                              <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">{item.type}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-6 text-[11px] font-bold">
                          <span className="flex items-center gap-2 bg-white/30 px-3 py-1 rounded-full"><i className="fa-solid fa-clock opacity-60"></i> {item.time}</span>
                          <span className="flex items-center gap-2 bg-white/30 px-3 py-1 rounded-full"><i className="fa-solid fa-tags opacity-60"></i> {item.audience}</span>
                          <span className="flex items-center gap-2 bg-white/30 px-3 py-1 rounded-full"><i className="fa-solid fa-chalkboard-user opacity-60"></i> {item.instructor || 'Staff'}</span>
                        </div>
                        <p className="text-sm opacity-80 leading-relaxed font-medium max-w-3xl">
                          {item.description}
                        </p>
                        <div className="absolute right-8 bottom-8 flex gap-3">
                          <button 
                            onClick={() => setSelectedPreview(item)}
                            className="px-8 py-3 rounded-2xl bg-white text-slate-800 font-black text-[11px] shadow-sm hover:shadow-xl transition-all border border-slate-100 uppercase tracking-widest"
                          >
                            Preview
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-300 border-2 border-dashed border-slate-50 rounded-[2rem]">
                    <i className="fa-solid fa-calendar-minus text-4xl mb-4 opacity-20"></i>
                    <p className="font-black text-xs uppercase tracking-widest text-slate-400">No {activeTypeFilter !== 'All' ? activeTypeFilter : 'Activities'} Scheduled</p>
                    <p className="text-[10px] mt-1 font-medium text-slate-400">Try selecting a different filter above</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Add Schedule Button - Editor Only */}
      {isEditor && (
        <div className="fixed bottom-24 right-6 z-50">
          <button 
            onClick={() => setIsAddingSchedule(true)}
            className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl shadow-2xl transition-all duration-300 active:scale-95 bg-gradient-to-tr from-purple-600 to-indigo-600 hover:rotate-90 group"
            title="Add New Lesson Slot"
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      )}

      {isAddingSchedule && isEditor && (
        <ScheduleCreationModal 
          projects={projects}
          onClose={() => setIsAddingSchedule(false)}
          onSave={(day, item) => {
            onAddItem(day, item);
            setIsAddingSchedule(false);
          }}
        />
      )}

      {/* Preview Modal */}
      {selectedPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row relative animate-in zoom-in-95 duration-300 border border-white/20">
            <button 
              onClick={() => setSelectedPreview(null)}
              className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white flex items-center justify-center transition-all shadow-xl"
            >
              <i className="fa-solid fa-times"></i>
            </button>

            {/* Big Image Section */}
            <div className="md:w-1/2 h-64 md:h-auto relative">
              <img 
                src={selectedPreview.imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200'} 
                className="w-full h-full object-cover" 
                alt={selectedPreview.title} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-10 left-10 right-10">
                <div className="px-4 py-1.5 bg-purple-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] mb-4 inline-block shadow-lg">
                  {selectedPreview.type}
                </div>
                <h2 className="text-4xl font-black text-white leading-tight tracking-tight">{selectedPreview.title}</h2>
              </div>
            </div>

            {/* Details Section */}
            <div className="md:w-1/2 p-10 md:p-14 overflow-y-auto max-h-[70vh] md:max-h-none flex flex-col bg-white">
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Time Slot</p>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-sm text-slate-700">
                    <i className="fa-regular fa-clock mr-2 text-purple-500"></i>
                    {selectedPreview.time}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Target Audience</p>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-sm text-slate-700">
                    <i className="fa-solid fa-users mr-2 text-purple-500"></i>
                    {selectedPreview.audience}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Session Overview</p>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {selectedPreview.description}
                </p>
              </div>

              <div className="mt-auto pt-12 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <i className="fa-solid fa-chalkboard-user"></i>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Instructor</p>
                    <p className="text-sm font-bold text-slate-900">{selectedPreview.instructor || 'Staff'}</p>
                  </div>
                </div>
                <button className="px-10 py-4 bg-purple-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-purple-100 hover:bg-purple-700 transition-all active:scale-95">
                  Book This Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleView;
