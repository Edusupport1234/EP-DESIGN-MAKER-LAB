import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Project, ScheduleItem, Lesson } from '../types';

interface ScheduleCreationModalProps {
  projects: Project[];
  lessons?: Lesson[];
  onClose: () => void;
  onSave: (day: string, item: ScheduleItem) => void;
}

const ScheduleCreationModal: React.FC<ScheduleCreationModalProps> = ({ projects, lessons = [], onClose, onSave }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const [isSelectingLesson, setIsSelectingLesson] = useState(false);
  const [selectedSource, setSelectedSource] = useState<{ id: string, title: string, description: string, imageUrl: string, category: string, difficulty?: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('11:30 AM');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [instructor, setInstructor] = useState('Lab Instructor');

  const startPickerRef = useRef<HTMLDivElement>(null);
  const endPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (startPickerRef.current && !startPickerRef.current.contains(event.target as Node)) setShowStartPicker(false);
      if (endPickerRef.current && !endPickerRef.current.contains(event.target as Node)) setShowEndPicker(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
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

  const calendarData = useMemo(() => {
    const currentMonth = viewDate.getMonth();
    const currentYear = viewDate.getFullYear();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    return { startingDay, daysInMonth };
  }, [viewDate]);

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
  };

  const isSelected = (day: number) => {
    return selectedDate.getDate() === day && selectedDate.getMonth() === viewDate.getMonth() && selectedDate.getFullYear() === viewDate.getFullYear();
  };

  const handleSave = () => {
    if (!selectedSource) {
      alert("Please select a lesson plan or project first.");
      return;
    }
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    onSave(dayName, {
      type: 'Workshop',
      title: selectedSource.title,
      time: `${startTime} - ${endTime}`,
      audience: selectedSource.difficulty || 'All Skill Levels',
      description: selectedSource.description,
      instructor: instructor,
      lessonId: selectedSource.id,
      imageUrl: selectedSource.imageUrl
    });
  };

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i);

  const combinedLibrary = useMemo(() => {
    const list = [
      ...lessons.map(l => ({ ...l, source: 'Mastery Course' })),
      ...projects.map(p => ({ ...p, source: 'Community Project', difficulty: p.grade }))
    ];
    if (!searchQuery.trim()) return list;
    const term = searchQuery.toLowerCase();
    return list.filter(item => item.title.toLowerCase().includes(term) || item.category.toLowerCase().includes(term));
  }, [lessons, projects, searchQuery]);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl h-[92vh] rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-300 border border-white/20">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Schedule New Workshop</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Select a date and link a lesson plan</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-900 transition-all flex items-center justify-center"><i className="fa-solid fa-times text-lg"></i></button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 flex flex-col gap-12 custom-scrollbar">
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <select 
                value={viewDate.getMonth()}
                onChange={(e) => setViewDate(new Date(viewDate.getFullYear(), parseInt(e.target.value), 1))}
                className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3.5 font-black text-sm text-slate-900 uppercase"
              >
                {monthNames.map((name, idx) => <option key={name} value={idx}>{name}</option>)}
              </select>
              <select 
                value={viewDate.getFullYear()}
                onChange={(e) => setViewDate(new Date(parseInt(e.target.value), viewDate.getMonth(), 1))}
                className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3.5 font-black text-sm text-slate-900"
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-7 gap-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <div key={d} className="text-[11px] font-black text-slate-300 uppercase text-center py-2 tracking-[0.2em]">{d}</div>)}
              {Array.from({ length: calendarData.startingDay }).map((_, i) => <div key={`empty-${i}`} className="aspect-square opacity-20"></div>)}
              {Array.from({ length: calendarData.daysInMonth }).map((_, i) => (
                <button key={i} onClick={() => handleDateClick(i + 1)} className={`aspect-square rounded-[1.5rem] flex flex-col items-center justify-center text-sm font-bold border transition-all ${isSelected(i + 1) ? 'bg-purple-600 border-purple-600 text-white shadow-2xl scale-105 z-10' : 'bg-slate-50 border-transparent text-slate-600 hover:bg-white hover:border-purple-200'}`}>{i + 1}</button>
              ))}
            </div>
          </section>

          <section className="space-y-10 pt-10 border-t border-slate-100">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Time & Plan Details</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="space-y-2 relative" ref={startPickerRef}>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Start Time</p>
                  <button onClick={() => setShowStartPicker(!showStartPicker)} className="w-44 h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 flex items-center justify-between group hover:border-purple-400 transition-all shadow-sm"><span className="font-black text-slate-900 text-sm tracking-widest">{startTime}</span><i className="fa-solid fa-clock-rotate-left text-slate-300 group-hover:text-purple-500"></i></button>
                  {showStartPicker && <div className="absolute top-full left-0 right-0 mt-3 max-h-60 overflow-y-auto bg-white border border-slate-100 rounded-2xl shadow-2xl z-[150] p-2 custom-scrollbar">{timeOptions.map(t => <button key={t} onClick={() => { setStartTime(t); setShowStartPicker(false); }} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black tracking-widest ${startTime === t ? 'bg-purple-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>{t}</button>)}</div>}
                </div>
                <div className="space-y-2 relative" ref={endPickerRef}>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">End Time</p>
                  <button onClick={() => setShowEndPicker(!showEndPicker)} className="w-44 h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 flex items-center justify-between group hover:border-purple-400 transition-all shadow-sm"><span className="font-black text-slate-900 text-sm tracking-widest">{endTime}</span><i className="fa-solid fa-clock-rotate-left text-slate-300 group-hover:text-purple-500"></i></button>
                  {showEndPicker && <div className="absolute top-full left-0 right-0 mt-3 max-h-60 overflow-y-auto bg-white border border-slate-100 rounded-2xl shadow-2xl z-[150] p-2 custom-scrollbar">{timeOptions.map(t => <button key={t} onClick={() => { setEndTime(t); setShowEndPicker(false); }} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black tracking-widest ${endTime === t ? 'bg-purple-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>{t}</button>)}</div>}
                </div>
              </div>
            </div>

            {selectedSource ? (
              <div className="p-10 bg-purple-50/50 rounded-[3rem] border-2 border-purple-200 border-dashed relative group">
                 <button onClick={() => setSelectedSource(null)} className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white text-purple-600 shadow-xl flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all scale-0 group-hover:scale-100"><i className="fa-solid fa-rotate-left"></i></button>
                 <div className="flex items-center gap-10">
                    <img src={selectedSource.imageUrl} className="w-28 h-28 rounded-[2rem] object-cover shadow-2xl border-4 border-white" alt="" />
                    <div className="flex-1">
                       <div className="text-[11px] font-black text-purple-400 uppercase tracking-[0.2em] mb-2">{selectedSource.category}</div>
                       <h4 className="text-2xl font-black text-slate-900 tracking-tight">{selectedSource.title}</h4>
                       <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed line-clamp-2">{selectedSource.description}</p>
                    </div>
                 </div>
              </div>
            ) : (
              <button onClick={() => setIsSelectingLesson(true)} className="w-full aspect-[21/6] rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 hover:border-purple-200 hover:bg-purple-50/20 group">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 shadow-sm"><i className="fa-solid fa-folder-plus text-2xl"></i></div>
                <p className="font-black text-xs uppercase tracking-[0.2em]">Select Content from Lab Library</p>
              </button>
            )}
          </section>
        </div>

        <div className="p-10 border-t border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <button onClick={onClose} className="px-10 py-5 text-slate-500 font-black text-xs uppercase tracking-[0.2em] hover:text-slate-900">Discard</button>
          <button onClick={handleSave} className="px-14 py-5 bg-purple-600 text-white rounded-[1.75rem] font-black text-xs uppercase tracking-[0.25em] shadow-2xl shadow-purple-100 hover:bg-purple-700 active:scale-95 transition-all">Save Schedule</button>
        </div>

        {isSelectingLesson && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-8 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl h-[80vh] rounded-[4rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
               <div className="px-12 py-8 border-b border-slate-100 flex items-center justify-between">
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Select Mastery Course or Project</h3>
                 <div className="flex-1 max-w-sm mx-12 hidden sm:block">
                   <input type="text" placeholder="Search library..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10" />
                 </div>
                 <button onClick={() => setIsSelectingLesson(false)} className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center"><i className="fa-solid fa-times"></i></button>
               </div>
               <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                  <div className="grid md:grid-cols-2 gap-8">
                    {combinedLibrary.map((item, idx) => (
                      <div key={idx} onClick={() => { setSelectedSource({ id: item.id, title: item.title, description: item.description, imageUrl: item.imageUrl, category: item.category, difficulty: item.difficulty }); setIsSelectingLesson(false); }} className="group flex gap-6 p-6 rounded-[2.5rem] border border-slate-100 hover:border-purple-200 hover:bg-purple-50/40 cursor-pointer transition-all shadow-sm hover:shadow-xl">
                        <img src={item.imageUrl} className="w-24 h-24 rounded-3xl object-cover shrink-0 shadow-lg border-2 border-white" alt="" />
                        <div>
                          <h4 className="font-black text-slate-900 text-base group-hover:text-purple-600 leading-tight">{item.title}</h4>
                          <div className="flex items-center gap-2 mt-2">
                             <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">{item.source}</span>
                             <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{item.category}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-3 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleCreationModal;