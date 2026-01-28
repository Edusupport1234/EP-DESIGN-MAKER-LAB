
import React, { useState } from 'react';
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

  if (!lesson) return null;

  const isLastLevel = currentLevelIndex === LESSONS.length - 1;

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
      if (activeStep >= (lesson.storySteps?.length || 0) - 1) {
        setActiveStep(Math.max(0, index - 1));
      }
    }
  };

  const hardwareComponents = [
    { name: 'micro:bit v2', quantity: 1, icon: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&q=80&w=100' },
    { name: 'USB-A to Mini-USB Cable', quantity: 1, icon: 'https://images.unsplash.com/photo-1589149098258-3e9102ca93d3?auto=format&fit=crop&q=80&w=100' }
  ];

  return (
    <div className="flex flex-col h-full bg-[#fcfcfd] text-slate-800 min-h-[700px]">
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
        <div className="w-72 border-r border-slate-200/60 bg-white hidden lg:flex flex-col p-6 overflow-y-auto shrink-0">
          <h3 className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] mb-6 px-2">Path Milestones</h3>
          <ul className="space-y-2">
            {lesson.storySteps?.map((step, i) => (
              <li key={i} className="group/item relative">
                <button 
                  onClick={() => setActiveStep(i)}
                  className={`w-full text-left p-3.5 rounded-2xl text-[13px] font-bold flex items-center gap-4 transition-all group border-2 pr-10 ${
                    activeStep === i 
                      ? 'bg-purple-50 border-purple-500 text-purple-900 shadow-md' 
                      : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${activeStep === i ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <i className={`fa-solid ${step.icon}`}></i>
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

        <div className="flex-1 overflow-y-auto bg-[#fcfcfd] scroll-smooth custom-scrollbar p-10">
          <div className="max-w-3xl mx-auto space-y-16 pb-32">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">{lesson.title}</h1>
              <div className="aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                <img src={lesson.imageUrl} className="w-full h-full object-cover" alt="" />
              </div>
            </div>

            <div className="bg-indigo-50/50 rounded-[2rem] p-8 border border-indigo-100">
              <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Lesson Overview</h3>
              <p className="text-xl text-slate-700 font-medium leading-relaxed">{lesson.description}</p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl space-y-6">
              <h2 className="text-2xl font-black">Build Materials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hardwareComponents.map((item, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                    <img src={item.icon} className="w-10 h-10 rounded-lg object-cover" alt="" />
                    <span className="text-sm font-bold text-slate-700">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {lesson.storySteps && lesson.storySteps.length > 0 && (
              <div className="space-y-8">
                <h2 className="text-2xl font-black">Step-by-Step Instructions</h2>
                <div className="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-purple-600"></div>
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center text-white">
                      <i className={`fa-solid ${lesson.storySteps?.[activeStep]?.icon} text-xl`}></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-black">{lesson.storySteps?.[activeStep]?.title}</h3>
                      <p className="text-[10px] text-slate-400 font-black uppercase">Step {activeStep + 1} of {lesson.storySteps?.length}</p>
                    </div>
                  </div>
                  <p className="text-lg text-slate-700 leading-relaxed font-medium">{lesson.storySteps?.[activeStep]?.content}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-24 bg-white border-t border-slate-200/60 px-8 flex items-center justify-between sticky bottom-0 z-40">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
            {currentLevelIndex + 1}
          </div>
          <span className="text-sm font-black text-slate-900 hidden sm:block truncate max-w-[200px]">{lesson.title}</span>
        </div>

        <div className="flex items-center gap-3">
          {isLastLevel ? (
            <button 
              onClick={isEditor ? handlePublish : onExit}
              disabled={isPublishing}
              className={`px-8 py-3.5 ${isEditor ? 'bg-emerald-600' : 'bg-slate-900'} text-white rounded-2xl text-[12px] font-black hover:opacity-90 shadow-xl flex items-center gap-3 uppercase tracking-widest transition-all`}
            >
              {isPublishing ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  Publishing...
                </>
              ) : (
                <>
                  <i className={`fa-solid ${isEditor ? 'fa-cloud-arrow-up' : 'fa-check'}`}></i>
                  {isEditor ? 'Feature in Gallery' : 'Complete Path'}
                </>
              )}
            </button>
          ) : (
            <button 
              onClick={onNext}
              className="px-8 py-3.5 bg-purple-600 text-white rounded-2xl text-[12px] font-black hover:bg-purple-700 shadow-xl shadow-purple-200 flex items-center gap-3 uppercase tracking-widest"
            >
              Next Level
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonPathDetail;
