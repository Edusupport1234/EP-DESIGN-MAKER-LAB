
import React, { useState } from 'react';
import AIAssistant from './components/AIAssistant';
import LabLayoutView from './components/tabs/LabLayoutView';
import ScheduleView from './components/tabs/ScheduleView';
import ProjectGalleryView from './components/tabs/ProjectGalleryView';
import LessonPathDetail from './components/LessonPathDetail';
import ProjectDetailView from './components/ProjectDetailView';
import ProjectCreationModal from './components/ProjectCreationModal';
import { TabType, Project, Lesson, Material, DaySchedule, ScheduleItem } from './types';
import { PROJECTS, LESSONS, MATERIALS, WEEKLY_SCHEDULE } from './constants';
// Initialize Firebase connection on app load
import './services/firebase';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Lab Layout');
  const [isLearningMode, setIsLearningMode] = useState(false);
  const [learningLevelIndex, setLearningLevelIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  
  // App Global State
  const [allProjects, setAllProjects] = useState<Project[]>(PROJECTS);
  const [allLessons, setAllLessons] = useState<Lesson[]>(LESSONS);
  const [allMaterials, setAllMaterials] = useState<Material[]>(MATERIALS);
  const [allSchedule, setAllSchedule] = useState<DaySchedule[]>(WEEKLY_SCHEDULE);

  const handleAddProject = (newProject: Project) => {
    setAllProjects(prev => [newProject, ...prev]);
    setActiveTab('Project Gallery');
    setIsCreatingProject(false);
  };

  const handleAddScheduleItem = (dayName: string, item: ScheduleItem) => {
    setAllSchedule(prev => prev.map(day => {
      if (day.day === dayName) {
        return { ...day, items: [...day.items, item] };
      }
      return day;
    }));
  };

  const handleAddLessonToGallery = (lesson: Lesson) => {
    const newProject: Project = {
      id: `p-lesson-${Date.now()}`,
      title: lesson.title,
      student: 'Lab Student',
      grade: 'Lab Certified',
      category: lesson.category,
      description: `Completed the ${lesson.title} mastery pathway.`,
      fullDescription: lesson.projectGoal,
      materials: [], 
      steps: lesson.storySteps || [],
      likes: 0,
      imageUrl: lesson.imageUrl,
      award: 'Course Completed'
    };
    
    setAllProjects(prev => [newProject, ...prev]);
    setActiveTab('Project Gallery');
    setIsLearningMode(false);
  };

  const handleRemoveStepFromProject = (projectId: string, stepIndex: number) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId && p.steps) {
        const newSteps = [...p.steps];
        newSteps.splice(stepIndex, 1);
        return { ...p, steps: newSteps };
      }
      return p;
    }));
    if (selectedProject?.id === projectId) {
      setSelectedProject(prev => {
        if (!prev || !prev.steps) return prev;
        const newSteps = [...prev.steps];
        newSteps.splice(stepIndex, 1);
        return { ...prev, steps: newSteps };
      });
    }
  };

  const handleRemoveStepFromLesson = (lessonId: string, stepIndex: number) => {
    setAllLessons(prev => prev.map(l => {
      if (l.id === lessonId && l.storySteps) {
        const newSteps = [...l.storySteps];
        newSteps.splice(stepIndex, 1);
        return { ...l, storySteps: newSteps };
      }
      return l;
    }));
  };

  const startLearning = () => {
    setLearningLevelIndex(0);
    setIsLearningMode(true);
  };

  const renderContent = () => {
    if (isLearningMode) {
      return (
        <LessonPathDetail 
          lesson={allLessons[learningLevelIndex]}
          currentLevelIndex={learningLevelIndex} 
          onNext={() => setLearningLevelIndex(prev => Math.min(prev + 1, allLessons.length - 1))} 
          onExit={() => setIsLearningMode(false)}
          onPublish={handleAddLessonToGallery}
          onRemoveStep={(idx) => handleRemoveStepFromLesson(allLessons[learningLevelIndex].id, idx)}
        />
      );
    }

    if (selectedProject) {
      return (
        <ProjectDetailView 
          project={selectedProject} 
          onExit={() => setSelectedProject(null)} 
          onRemoveStep={(idx) => handleRemoveStepFromProject(selectedProject.id, idx)}
        />
      );
    }

    switch (activeTab) {
      case 'Lab Layout': return <LabLayoutView onEnroll={startLearning} />;
      case 'Schedule': return (
        <ScheduleView 
          schedule={allSchedule} 
          projects={allProjects}
          onAddItem={handleAddScheduleItem}
        />
      );
      case 'Project Gallery': return (
        <ProjectGalleryView 
          projects={allProjects} 
          onSelectProject={setSelectedProject} 
          onOpenCreation={() => setIsCreatingProject(true)}
        />
      );
      default: return <LabLayoutView onEnroll={startLearning} />;
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50/30 pb-20">
      <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 w-full fixed top-0 z-[60]"></div>
      
      <header className={`pt-8 px-6 max-w-7xl mx-auto transition-opacity duration-300 ${isLearningMode || selectedProject ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'}`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
             <img 
               src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStOQQrCJ8rmaj-TLbkMU6TFRj2XsSLnDXzEQ&s" 
               alt="STEM Academy Logo" 
               className="h-12 md:h-16 w-auto object-contain rounded-lg"
             />
          </div>

          <div className="flex items-center gap-4">
             <div className="text-xs font-black text-indigo-600 uppercase tracking-widest hidden sm:block">Open Access Workspace</div>
             <div className="flex items-center gap-3">
               <div className="text-right hidden sm:block">
                 <div className="text-[10px] font-black text-slate-900 leading-none uppercase">Lab Student</div>
                 <div className="text-[8px] font-bold text-slate-400 uppercase">Guest Mode</div>
               </div>
               <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm overflow-hidden">
                 <i className="fa-solid fa-user"></i>
               </div>
             </div>
          </div>
        </div>

        <div className="bg-white p-1.5 rounded-2xl flex items-center gap-1 shadow-sm border border-slate-100 max-w-fit mb-10 overflow-x-auto">
          {[
            { id: 'Lab Layout', icon: 'fa-hammer' },
            { id: 'Schedule', icon: 'fa-calendar-days' },
            { id: 'Project Gallery', icon: 'fa-images' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              {tab.id}
            </button>
          ))}
        </div>
      </header>

      <main className={`max-w-7xl mx-auto px-6 ${isLearningMode || selectedProject ? 'mt-8' : ''}`}>
        <div className={`bg-white rounded-[2.5rem] shadow-xl border border-indigo-100/50 min-h-[600px] relative overflow-hidden transition-all duration-500 ${isLearningMode || selectedProject ? 'p-0' : 'p-8 md:p-12'}`}>
          {renderContent()}
        </div>
      </main>

      {isCreatingProject && (
        <ProjectCreationModal 
          onClose={() => setIsCreatingProject(false)} 
          onSubmit={handleAddProject} 
        />
      )}

      <AIAssistant />
    </div>
  );
};

export default App;
