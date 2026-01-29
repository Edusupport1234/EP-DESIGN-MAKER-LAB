
import React, { useState, useRef, useEffect } from 'react';
import { Lesson, Difficulty } from '../types';
import { LESSONS } from '../constants';

interface LessonPathDetailProps {
  lesson: Lesson;
  currentLevelIndex: number;
  onNext: () => void;
  onExit: () => void;
  onPublish?: (lesson: Lesson) => void;
  onRemoveStep?: (index: number) => void;
  isEditor?: boolean;
}

const LessonPathDetail: React.FC<LessonPathDetailProps> = ({ lesson, currentLevelIndex, onNext, onExit, onPublish, onRemoveStep, isEditor = false }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  if (!lesson) return null;

  const isLastLevel = currentLevelIndex === LESSONS.length - 1;

  // Handle smooth scroll when a milestone is clicked
  const handleMilestoneClick = (index: number) => {
    setActiveStep(index);
    const target = stepRefs.current[index];
    if (target && scrollContainerRef.current) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Sync sidebar active state with scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observerOptions = {
      root: container,
      rootMargin: '-20% 0% -70% 0%', // Focus on the top area of the scroll view
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute('data-step-index'));
          if (!isNaN(index)) {
            setActiveStep(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [lesson.storySteps]);

  const handlePublish = () => {
    if (!onPublish) return;
    setIsPublishing(true);
    setTimeout(() => {
      onPublish(lesson);
      setIsPublishing(false);
    }, 1500);
  };

  const handleRemove = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (onRemoveStep) {
      onRemoveStep(index);
    }
  };

  const hardwareComponents = [
    { name: 'micro:bit v2', quantity: 1, icon: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&q=80&w=100' },
    { name: 'USB-A to Mini-USB Cable', quantity: 1, icon: 'https://images.unsplash.com/photo-1589149098258-3e9102ca93d3?auto=format&fit=crop&q=80&w=100' }
  ];

  return (
    <div className="flex flex-col h-full bg-[#fcfcfd] text-slate-800 min-h-[700px]">
      {/* Fixed Sub-Header */}
      <div className="bg-white border-b border-slate-200/60 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-6">
          <button 
            onClick={onExit} 
            className="w-10 h-10 rounded-xl hover:bg-slate-50 border border-slate-100 flex items-center justify-center transition-all text-slate-400 hover:text-slate-900 shadow-sm"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-black uppercase tracking-widest">MASTERY PATH</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{lesson.category}</span>
            </div>
            <h2 className="text-sm font-black text-slate-900">Current Level: {lesson.difficulty}</h2>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full">
          {LESSONS.map((_, i) => (
            <div 
              key={i} 
              className={`h-2.5 w-10 rounded-full transition-all duration-500 ${i <= currentLevelIndex ? 'bg-purple-600 shadow-sm' : 'bg-slate-300'}`}
            ></div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Navigation Milestones */}
        <div className="w-72 border-r border-slate-200/60 bg-white hidden lg:flex flex-col p-6 overflow-y-auto shrink-0 sticky top-0">
          <h3 className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] mb-6 px-2">Path Milestones</h3>
          <ul className="space-y-2">
            {lesson.storySteps?.map((step, i) => (
              <li key={i} className="group/item relative">
                <button 
                  onClick={() => handleMilestoneClick(i)}
                  className={`w-full text-left p-3.5 rounded-2xl text-[13px] font-bold flex items-center gap-4 transition-all group border-2 pr-10 ${
                    activeStep === i 
                      ? 'bg-purple-50 border-purple-500 text-purple-900 shadow-md shadow-purple-100' 
                      : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    activeStep === i ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                  }`}>
                    <i className={`fa-solid ${step.icon} text-[12px]`}></i>
                  </div>
                  <span className="truncate">{step.title}</span>
                </button>
                {isEditor && (
                  <button 
                    onClick={(e) => handleRemove(e, i)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-rose-50 text-rose-400 opacity-0 group-hover/item:opacity-100 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                  >
                    <i className="fa-solid fa-minus text-[10px]"></i>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content Area - Scrollable */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto bg-[#fcfcfd] scroll-smooth custom-scrollbar p-10"
        >
          <div className="max-w-3xl mx-auto space-y-24 pb-48">
            
            {/* Header Section */}
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">{lesson.title}</h1>
              <div className="aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                <img src={lesson.imageUrl} className="w-full h-full object-cover" alt={lesson.title} />
              </div>
              
              <div className="bg-indigo-50/50 rounded-[2.5rem] p-10 border border-indigo-100">
                <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Lesson Overview</h3>
                <p className="text-xl text-slate-700 font-medium leading-relaxed">{lesson.description}</p>
              </div>
            </div>

            {/* Build Materials Section */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl space-y-8">
              <h2 className="text-2xl font-black flex items-center gap-3">
                <i className="fa-solid fa-toolbox text-purple-500"></i>
                Build Materials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hardwareComponents.map((item, i) => (
                  <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 hover:bg-white hover:border-purple-200 transition-all cursor-default">
                    <img src={item.icon} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">{item.name}</span>
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Qty: {item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps Section - Rendered sequentially for scrolling */}
            <div className="space-y-12">
              <h2 className="text-2xl font-black flex items-center gap-3">
                <i className="fa-solid fa-stairs text-purple-500"></i>
                Detailed Instructions
              </h2>
              
              <div className="space-y-16">
                {lesson.storySteps?.map((step, i) => (
                  <div 
                    key={i} 
                    ref={el => stepRefs.current[i] = el}
                    data-step-index={i}
                    className={`bg-white rounded-[3rem] p-12 border transition-all duration-700 shadow-xl relative overflow-hidden group/step ${
                      activeStep === i ? 'border-purple-500 ring-4 ring-purple-500/5' : 'border-slate-100'
                    }`}
                  >
                    {/* Step Indicator on left */}
                    <div className="absolute top-0 left-0 w-2 h-full bg-purple-600 transition-transform duration-500 group-hover/step:scale-y-110"></div>
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-8 mb-10">
                      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover/step:rotate-6 ${
                        activeStep === i ? 'bg-purple-600 shadow-purple-200' : 'bg-slate-900 shadow-slate-200'
                      }`}>
                        <i className={`fa-solid ${step.icon} text-3xl`}></i>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Step {i + 1} of {lesson.storySteps?.length}</div>
                        <h3 className="text-3xl font-black text-slate-900">{step.title}</h3>
                      </div>
                    </div>
                    
                    <p className="text-xl text-slate-700 leading-relaxed font-medium">
                      {step.content}
                    </p>

                    {/* Completion Check (Visual only) */}
                    <div className="mt-10 flex justify-end">
                       <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                         activeStep > i ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-100 text-slate-200'
                       }`}>
                         <i className="fa-solid fa-check text-lg"></i>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Bottom Controls */}
      <div className="h-24 bg-white border-t border-slate-200/60 px-8 flex items-center justify-between sticky bottom-0 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black shadow-sm">
            {currentLevelIndex + 1}
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Active Level</p>
            <span className="text-sm font-black text-slate-900 truncate max-w-[200px]">{lesson.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isLastLevel ? (
            <button 
              onClick={isEditor ? handlePublish : onExit}
              disabled={isPublishing}
              className={`px-10 py-4 ${isEditor ? 'bg-emerald-600 shadow-emerald-100' : 'bg-slate-900 shadow-slate-100'} text-white rounded-[1.5rem] text-[12px] font-black hover:opacity-90 shadow-xl flex items-center gap-3 uppercase tracking-widest transition-all active:scale-95`}
            >
              {isPublishing ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  Processing Submission
                </>
              ) : (
                <>
                  <i className={`fa-solid ${isEditor ? 'fa-cloud-arrow-up' : 'fa-check-double'}`}></i>
                  {isEditor ? 'Publish to Community' : 'Complete Path'}
                </>
              )}
            </button>
          ) : (
            <button 
              onClick={onNext}
              className="px-10 py-4 bg-purple-600 text-white rounded-[1.5rem] text-[12px] font-black hover:bg-purple-700 shadow-xl shadow-purple-200 flex items-center gap-3 uppercase tracking-widest transition-all active:scale-95"
            >
              Master Next Level
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonPathDetail;
