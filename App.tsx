import React, { useState, useEffect, useMemo } from 'react';
import AIAssistant from './components/AIAssistant';
import LabLayoutView from './components/tabs/LabLayoutView';
import ScheduleView from './components/tabs/ScheduleView';
import ProjectGalleryView from './components/tabs/ProjectGalleryView';
import LessonPathDetail from './components/LessonPathDetail';
import ProjectDetailView from './components/ProjectDetailView';
import ProjectCreationModal from './components/ProjectCreationModal';
import LoginScreen from './components/LoginScreen';
import { TabType, Project, Lesson, DaySchedule, ScheduleItem, UserInfo } from './types';
import { PROJECTS, LESSONS, WEEKLY_SCHEDULE } from './constants';
import { auth } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const App: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('Lab Layout');
  const [isLearningMode, setIsLearningMode] = useState(false);
  const [learningLesson, setLearningLesson] = useState<Lesson | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  
  // Dynamic Content States
  const [allProjects, setAllProjects] = useState<Project[]>(PROJECTS);
  const [allLessons] = useState<Lesson[]>(LESSONS);

  // Helper to generate schedule for the "Current Week" relative to today
  const getDynamicSchedule = (): DaySchedule[] => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
    
    const dayMap: { [key: string]: number } = {
      'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
      'Thursday': 4, 'Friday': 5, 'Saturday': 6
    };

    return WEEKLY_SCHEDULE.map(day => {
      const targetDayNum = dayMap[day.day];
      // Calculate diff to get to the corresponding day of the current week
      const diff = targetDayNum - dayOfWeek;
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + diff);
      
      return {
        ...day,
        date: targetDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      };
    });
  };

  const [allSchedule, setAllSchedule] = useState<DaySchedule[]>(getDynamicSchedule());

  // Gamification & Progress States
  const [totalXP, setTotalXP] = useState(0);
  const [completedToday, setCompletedToday] = useState<string[]>([]);
  const [userLikedProjects, setUserLikedProjects] = useState<string[]>([]);

  // Editor Check: Including the requested Gmail account
  const isEditor = user?.email === 'Edusupport@ep-asia.com' || user?.email === 'waynexavwillis@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'Anonymous',
          picture: firebaseUser.photoURL || '',
          sub: firebaseUser.uid
        });
      } else {
        setUser(null);
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // Compute Today's Schedule and Lessons
  // We use the day name to find the right schedule, then merge details for UI sync
  const todayName = useMemo(() => new Date().toLocaleDateString('en-US', { weekday: 'long' }), []);
  
  const todayLessons = useMemo(() => {
    const todaySched = allSchedule.find(s => s.day === todayName);
    if (!todaySched) return [];
    
    // Map schedule items to full lesson objects, merging schedule meta for sync
    return todaySched.items
      .filter(item => item.lessonId)
      .map(item => {
        const lesson = allLessons.find(l => l.id === item.lessonId);
        if (!lesson) return null;
        return {
          ...lesson,
          title: item.title, // Sync title with Schedule
          description: item.description, // Sync description with Schedule
          imageUrl: item.imageUrl || lesson.imageUrl // Prefer specific schedule imagery
        };
      })
      .filter((l): l is Lesson => !!l);
  }, [allSchedule, allLessons, todayName]);

  const handleAddProject = (newProject: Project) => {
    if (!isEditor) return;
    setAllProjects(prev => [newProject, ...prev]);
    setActiveTab('Project Gallery');
    setIsCreatingProject(false);
  };

  const handleAddScheduleItem = (dayName: string, item: ScheduleItem) => {
    if (!isEditor) return;
    setAllSchedule(prev => prev.map(day => {
      if (day.day === dayName) {
        return { ...day, items: [...day.items, item] };
      }
      return day;
    }));
  };

  const toggleProjectLike = (projectId: string) => {
    const isCurrentlyLiked = userLikedProjects.includes(projectId);
    
    setAllProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, likes: isCurrentlyLiked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    }));

    setUserLikedProjects(prev => 
      isCurrentlyLiked ? prev.filter(id => id !== projectId) : [...prev, projectId]
    );
  };

  const handleCompleteLesson = (lesson: Lesson) => {
    if (!completedToday.includes(lesson.id)) {
      setCompletedToday(prev => [...prev, lesson.id]);
      setTotalXP(prev => prev + 50);
    }
    
    // If editor, also publish to gallery
    if (isEditor) {
      const newProject: Project = {
        id: `p-lesson-${Date.now()}`,
        title: lesson.title,
        student: user?.name || 'Lab Student',
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
    }

    setIsLearningMode(false);
    setLearningLesson(null);
  };

  const startLearning = (lesson: Lesson) => {
    setLearningLesson(lesson);
    setIsLearningMode(true);
  };

  const handleSignOut = async () => {
    try { await signOut(auth); } catch (error) { console.error('Sign-out error:', error); }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#f3f1ff] flex items-center justify-center">
        <i className="fa-solid fa-circle-notch animate-spin text-indigo-500 text-4xl"></i>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  const renderContent = () => {
    if (isLearningMode && learningLesson) {
      // Find index of this lesson in our "Today's" or "All" list for the progress bar
      const idx = allLessons.findIndex(l => l.id === learningLesson.id);
      return (
        <LessonPathDetail 
          lesson={learningLesson}
          currentLevelIndex={idx === -1 ? 0 : idx} 
          onNext={() => {}} // Could implement sequence logic here
          onExit={() => setIsLearningMode(false)}
          onPublish={() => handleCompleteLesson(learningLesson)}
          isEditor={isEditor}
        />
      );
    }

    if (selectedProject) {
      return (
        <ProjectDetailView 
          project={allProjects.find(p => p.id === selectedProject.id) || selectedProject} 
          onExit={() => setSelectedProject(null)} 
          isEditor={isEditor}
          isLiked={userLikedProjects.includes(selectedProject.id)}
          onToggleLike={() => toggleProjectLike(selectedProject.id)}
        />
      );
    }

    switch (activeTab) {
      case 'Lab Layout': return (
        <LabLayoutView 
          onEnroll={startLearning} 
          todayLessons={todayLessons}
          completedToday={completedToday}
          totalXP={totalXP}
        />
      );
      case 'Schedule': return (
        <ScheduleView 
          schedule={allSchedule} 
          projects={allProjects}
          onAddItem={handleAddScheduleItem}
          isEditor={isEditor}
        />
      );
      case 'Project Gallery': return (
        <ProjectGalleryView 
          projects={allProjects} 
          onSelectProject={setSelectedProject} 
          onOpenCreation={() => setIsCreatingProject(true)}
          isEditor={isEditor}
          userLikedProjects={userLikedProjects}
          onToggleLike={toggleProjectLike}
        />
      );
      default: return (
        <LabLayoutView 
          onEnroll={startLearning} 
          todayLessons={todayLessons}
          completedToday={completedToday}
          totalXP={totalXP}
        />
      );
    }
  };

  const isDetailView = isLearningMode || selectedProject;

  return (
    <div className="min-h-screen bg-[#f3f1ff] pb-32 grid-bg">
      <header className={`pt-12 px-8 max-w-[1400px] mx-auto transition-all duration-700 ${isDetailView ? 'opacity-0 -translate-y-full absolute' : 'opacity-100 translate-y-0'}`}>
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-white rounded-[2rem] shadow-2xl border border-white flex items-center justify-center p-4">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStOQQrCJ8rmaj-TLbkMU6TFRj2XsSLnDXzEQ&s" 
                alt="Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Design Maker Lab</h1>
              <div className="flex items-center gap-4 mt-3">
                 <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Mastery Workspace</span>
                 <div className="w-1.5 h-1.5 bg-indigo-200 rounded-full"></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{isEditor ? 'Staff Console' : 'Student Hub'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-[2.5rem] border border-white shadow-xl flex items-center gap-5">
                <div className="text-right hidden sm:block">
                   <div className="text-xs font-black text-slate-900 leading-none">{user.name}</div>
                   <div className="text-[9px] font-black text-indigo-400 mt-1 uppercase tracking-widest">{user.email}</div>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-indigo-100 p-0.5 shadow-sm overflow-hidden">
                   {user.picture ? (
                     <img src={user.picture} alt={user.name} className="w-full h-full rounded-full object-cover" />
                   ) : (
                     <div className="w-full h-full rounded-full bg-indigo-50 flex items-center justify-center text-indigo-300">
                       <i className="fa-solid fa-user"></i>
                     </div>
                   )}
                </div>
             </div>
             <button 
               onClick={handleSignOut}
               className="w-14 h-14 rounded-3xl bg-white border border-white flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all shadow-xl active:scale-90"
             >
               <i className="fa-solid fa-right-from-bracket text-lg"></i>
             </button>
          </div>
        </div>

        <div className="flex items-center justify-center lg:justify-start">
          <nav className="bg-slate-900/95 backdrop-blur-xl p-2 rounded-full flex items-center gap-1 shadow-2xl shadow-indigo-900/10">
            {[
              { id: 'Lab Layout', icon: 'fa-cube', color: 'bg-[#ffde59] text-slate-900' },
              { id: 'Schedule', icon: 'fa-calendar-day', color: 'bg-indigo-500 text-white' },
              { id: 'Project Gallery', icon: 'fa-shapes', color: 'bg-purple-600 text-white' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-10 py-5 rounded-full font-black text-[11px] uppercase tracking-widest flex items-center gap-3 transition-all ${
                  activeTab === tab.id 
                    ? tab.color + ' shadow-lg scale-105' 
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <i className={`fa-solid ${tab.icon} text-xs`}></i>
                {tab.id}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className={`max-w-[1400px] mx-auto px-8 transition-all duration-700 ${isDetailView ? 'mt-8' : 'mt-16'}`}>
        <div className={`bg-white rounded-[4rem] shadow-[0_50px_120px_rgba(99,102,241,0.04)] border border-white/50 min-h-[750px] relative overflow-hidden transition-all duration-500 ${isDetailView ? 'p-0' : 'p-12 md:p-20'}`}>
          {renderContent()}
        </div>
      </main>

      {isCreatingProject && isEditor && (
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