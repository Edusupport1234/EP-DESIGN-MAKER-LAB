
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Project, ScheduleItem } from '../types';

interface ScheduleCreationModalProps {
  projects: Project[];
  onClose: () => void;
  onSave: (day: string, item: ScheduleItem) => void;
}

const ScheduleCreationModal: React.FC<ScheduleCreationModalProps> = ({ projects, onClose, onSave }) => {
  // Current view state (which month/year is shown)
  const [viewDate, setViewDate] = useState(new Date());
  // User's selected date
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const [isSelectingLesson, setIsSelectingLesson] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [lessonSearchTerm, setLessonSearchTerm] = useState('');
  
  // Time Selection State
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('11:30 AM');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [instructor, setInstructor] = useState('Lab Instructor');

  const startPickerRef = useRef<HTMLDivElement>(null);
  const endPickerRef = useRef<HTMLDivElement>(null);

  // Close pickers on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (startPickerRef.current && !startPickerRef.current.contains(event.target as Node)) setShowStartPicker(false);
      if (endPickerRef.current && !endPickerRef.current.contains(event.target as Node)) setShowEndPicker(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  // Generate time options in 15 min increments
  const timeOptions = useMemo(() => {
    const options = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        const hour = h % 12 === 0 ? 12 : h % 12;
        const ampm = h >= 12 ? 'PM' : 'AM';
        const minute = m.toString().padStart(2, '0');
        options.push(`${hour}:${minute} ${ampm}`);
      }
    }
    return options;
  }, []);

  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();

  const calendarData = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    return { startingDay, daysInMonth };
  }, [currentMonth, currentYear]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewDate(new Date(currentYear, parseInt(e.target.value), 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewDate(new Date(parseInt(e.target.value), currentMonth, 1));
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(currentYear, currentMonth, day));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
  };

  const isSelected = (day: number) => {
    return selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear;
  };

  const handleSave = () => {
    if (!selectedProject) {
      alert("Please select a lesson plan first.");
      return;
    }
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    onSave(dayName, {
      type: 'Workshop',
      title: selectedProject.title,
      time: `${startTime} - ${endTime}`,
      audience: selectedProject.grade,
      description: selectedProject.description,
      instructor: instructor,
      imageUrl: selectedProject.imageUrl
    });
  };

  const years = Array.from({ length: 21 }, (_, i) => new Date().getFullYear() - 10 + i);

  // Filtered projects for the sub-modal
  const filteredProjects = useMemo(() => {
    if (!lessonSearchTerm.trim()) return projects;
    const term = lessonSearchTerm.toLowerCase();
    return projects.filter(p => 
      p.title.toLowerCase().includes(term) || 
      p.student.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  }, [projects, lessonSearchTerm]);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl h-[92vh] rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-300 border border-white/20">
        
        {/* Header */}
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Schedule New Workshop</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Select a date and link a lesson plan</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-900 transition-all flex items-center justify-center">
            <i className="fa-solid fa-times text-lg"></i>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-12 flex flex-col gap-12 custom-scrollbar">
          
          {/* Calendar Section */}
          <section className="space-y-8">
            <div className="flex items-center justify-start px-2">
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <select 
                    value={currentMonth}
                    onChange={handleMonthChange}
                    className="appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3.5 pr-12 font-black text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-500/10 cursor-pointer uppercase tracking-widest transition-all hover:bg-white hover:border-purple-200"
                  >
                    {monthNames.map((name, idx) => (
                      <option key={name} value={idx}>{name}</option>
                    ))}
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none group-hover:text-purple-500 transition-colors"></i>
                </div>

                <div className="relative group">
                  <select 
                    value={currentYear}
                    onChange={handleYearChange}
                    className="appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3.5 pr-12 font-black text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-500/10 cursor-pointer transition-all hover:bg-white hover:border-purple-200"
                  >
                    {years.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none group-hover:text-purple-500 transition-colors"></i>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <div key={d} className="text-[11px] font-black text-slate-300 uppercase text-center py-2 tracking-[0.2em]">{d}</div>
              ))}
              
              {Array.from({ length: calendarData.startingDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square opacity-20"></div>
              ))}

              {Array.from({ length: calendarData.daysInMonth }).map((_, i) => {
                const day = i + 1;
                const active = isSelected(day);
                const current = isToday(day);
                
                return (
                  <button 
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`aspect-square rounded-[1.5rem] flex flex-col items-center justify-center text-sm font-bold border transition-all relative group ${
                      active 
                        ? 'bg-purple-600 border-purple-600 text-white shadow-2xl shadow-purple-200 scale-105 z-10' 
                        : 'bg-slate-50 border-transparent text-slate-600 hover:bg-white hover:border-purple-200 hover:shadow-xl'
                    }`}
                  >
                    {day}
                    {current && !active && <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-purple-500 rounded-full"></div>}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Time & Plan Selection Section */}
          <section className="space-y-10 pt-10 border-t border-slate-100">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Time & Plan Details</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Rolling Start Time Picker */}
                <div className="space-y-2 relative" ref={startPickerRef}>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Start Time</p>
                  <button 
                    onClick={() => { setShowStartPicker(!showStartPicker); setShowEndPicker(false); }}
                    className="w-44 h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 flex items-center justify-between group hover:border-purple-400 transition-all shadow-sm"
                  >
                    <span className="font-black text-slate-900 text-sm tracking-widest">{startTime}</span>
                    <i className={`fa-solid fa-clock-rotate-left text-slate-300 group-hover:text-purple-500 transition-colors ${showStartPicker ? 'rotate-180 text-purple-600' : ''}`}></i>
                  </button>
                  {showStartPicker && (
                    <div className="absolute top-full left-0 right-0 mt-3 max-h-60 overflow-y-auto bg-white border border-slate-100 rounded-2xl shadow-2xl z-[150] p-2 animate-in slide-in-from-top-2 duration-200 custom-scrollbar">
                      {timeOptions.map(t => (
                        <button 
                          key={t}
                          onClick={() => { setStartTime(t); setShowStartPicker(false); }}
                          className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black tracking-widest transition-all ${startTime === t ? 'bg-purple-600 text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-purple-600'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 text-slate-200">
                  <i className="fa-solid fa-minus"></i>
                </div>

                {/* Rolling End Time Picker */}
                <div className="space-y-2 relative" ref={endPickerRef}>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">End Time</p>
                  <button 
                    onClick={() => { setShowEndPicker(!showEndPicker); setShowStartPicker(false); }}
                    className="w-44 h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 flex items-center justify-between group hover:border-purple-400 transition-all shadow-sm"
                  >
                    <span className="font-black text-slate-900 text-sm tracking-widest">{endTime}</span>
                    <i className={`fa-solid fa-clock-rotate-left text-slate-300 group-hover:text-purple-500 transition-colors ${showEndPicker ? 'rotate-180 text-purple-600' : ''}`}></i>
                  </button>
                  {showEndPicker && (
                    <div className="absolute top-full left-0 right-0 mt-3 max-h-60 overflow-y-auto bg-white border border-slate-100 rounded-2xl shadow-2xl z-[150] p-2 animate-in slide-in-from-top-2 duration-200 custom-scrollbar">
                      {timeOptions.map(t => (
                        <button 
                          key={t}
                          onClick={() => { setEndTime(t); setShowEndPicker(false); }}
                          className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black tracking-widest transition-all ${endTime === t ? 'bg-purple-600 text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-purple-600'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedProject ? (
              <div className="p-10 bg-purple-50/50 rounded-[3rem] border-2 border-purple-200 border-dashed relative group animate-in slide-in-from-bottom-6">
                 <button 
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white text-purple-600 shadow-xl flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all scale-0 group-hover:scale-100"
                 >
                   <i className="fa-solid fa-rotate-left"></i>
                 </button>
                 <div className="flex items-center gap-10">
                    <img src={selectedProject.imageUrl} className="w-28 h-28 rounded-[2rem] object-cover shadow-2xl border-4 border-white" alt="" />
                    <div className="flex-1">
                       <div className="text-[11px] font-black text-purple-400 uppercase tracking-[0.2em] mb-2">{selectedProject.category}</div>
                       <h4 className="text-2xl font-black text-slate-900 tracking-tight">{selectedProject.title}</h4>
                       <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed line-clamp-2">{selectedProject.description}</p>
                    </div>
                 </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsSelectingLesson(true)}
                className="w-full aspect-[21/6] rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 hover:border-purple-200 hover:bg-purple-50/20 hover:text-purple-400 transition-all group"
              >
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                  <i className="fa-solid fa-folder-plus text-2xl"></i>
                </div>
                <p className="font-black text-xs uppercase tracking-[0.2em]">Select Lesson Plan from Lab Library</p>
              </button>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="p-10 border-t border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <button 
            onClick={onClose}
            className="px-10 py-5 text-slate-500 font-black text-xs uppercase tracking-[0.2em] hover:text-slate-900 transition-colors"
          >
            Discard
          </button>
          <button 
            onClick={handleSave}
            className="px-14 py-5 bg-purple-600 text-white rounded-[1.75rem] font-black text-xs uppercase tracking-[0.25em] shadow-2xl shadow-purple-100 hover:bg-purple-700 active:scale-95 transition-all"
          >
            Save
          </button>
        </div>

        {/* Sub-modal: Gallery Picker */}
        {isSelectingLesson && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-8 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl h-[80vh] rounded-[4rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
               <div className="px-12 py-8 border-b border-slate-100 flex items-center justify-between">
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Select Mastery Course</h3>
                 
                 <div className="flex-1 max-w-sm mx-12 hidden sm:block">
                   <div className="relative group">
                     <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-500 transition-colors"></i>
                     <input 
                       type="text" 
                       placeholder="Search courses..." 
                       value={lessonSearchTerm}
                       onChange={(e) => setLessonSearchTerm(e.target.value)}
                       className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:bg-white focus:border-purple-200 transition-all"
                     />
                   </div>
                 </div>

                 <button onClick={() => { setIsSelectingLesson(false); setLessonSearchTerm(''); }} className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center">
                   <i className="fa-solid fa-times text-sm"></i>
                 </button>
               </div>
               
               {/* Mobile Search Input */}
               <div className="px-12 py-4 border-b border-slate-100 sm:hidden">
                 <div className="relative group">
                   <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
                   <input 
                     type="text" 
                     placeholder="Search courses..." 
                     value={lessonSearchTerm}
                     onChange={(e) => setLessonSearchTerm(e.target.value)}
                     className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:bg-white transition-all"
                   />
                 </div>
               </div>

               <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                  {filteredProjects.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-8">
                      {filteredProjects.map(p => (
                        <div 
                          key={p.id} 
                          onClick={() => { setSelectedProject(p); setIsSelectingLesson(false); setLessonSearchTerm(''); }}
                          className="group flex gap-6 p-6 rounded-[2.5rem] border border-slate-100 hover:border-purple-200 hover:bg-purple-50/40 cursor-pointer transition-all shadow-sm hover:shadow-xl"
                        >
                          <img src={p.imageUrl} className="w-24 h-24 rounded-3xl object-cover shrink-0 shadow-lg border-2 border-white" alt="" />
                          <div>
                            <h4 className="font-black text-slate-900 text-base group-hover:text-purple-600 transition-colors leading-tight">{p.title}</h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{p.category}</p>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-3 leading-relaxed">{p.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                      <i className="fa-solid fa-magnifying-glass text-4xl mb-4 opacity-20"></i>
                      <p className="font-black text-xs uppercase tracking-widest text-slate-400">No results found for "{lessonSearchTerm}"</p>
                      <button 
                        onClick={() => setLessonSearchTerm('')}
                        className="mt-4 text-[10px] font-black text-purple-600 uppercase tracking-widest hover:underline"
                      >
                        Clear Search
                      </button>
                    </div>
                  )}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleCreationModal;
