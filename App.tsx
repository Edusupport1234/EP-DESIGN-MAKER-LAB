
import React, { useState, useEffect, useMemo } from 'react';
import AIAssistant from './components/AIAssistant';
import LabLayoutView from './components/tabs/LabLayoutView';
import ScheduleView from './components/tabs/ScheduleView';
import ProjectGalleryView from './components/tabs/ProjectGalleryView';
import LessonPathDetail from './components/LessonPathDetail';
import ProjectDetailView from './components/ProjectDetailView';
import ProjectCreationModal from './components/ProjectCreationModal';
import LoginScreen from './components/LoginScreen';
import { TabType, Project, Lesson, DaySchedule, ScheduleItem, UserInfo, Difficulty } from './types';
import { PROJECTS, LESSONS, WEEKLY_SCHEDULE } from './constants';
import { auth, db, ref, onValue, push, set } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

interface LogEntry {
  id: string;
  title: string;
  timestamp: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('Lab Layout');
  const [isLearningMode, setIsLearningMode] = useState(false);
  const [learningLesson, setLearningLesson] = useState<Lesson | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  
  const [allProjects, setAllProjects] = useState<Project[]>(PROJECTS);
  const [allLessons] = useState<Lesson[]>(LESSONS);

  const getDynamicSchedule = (sourceSchedule: DaySchedule[]): DaySchedule[] => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const dayMap: { [key: string]: number } = {
      'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
      'Thursday': 4, 'Friday': 5, 'Saturday': 6
    };
    return sourceSchedule.map(day => {
      const targetDayNum = dayMap[day.day];
      const diff = targetDayNum - dayOfWeek;
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + diff);
      return {
        ...day,
        date: targetDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      };
    });
  };

  const [allSchedule, setAllSchedule] = useState<DaySchedule[]>(getDynamicSchedule(WEEKLY_SCHEDULE));
  const [totalXP, setTotalXP] = useState(0);
  const [completedToday, setCompletedToday] = useState<string[]>([]);
  const [activityLog, setActivityLog] = useState<LogEntry[]>([]);
  const [userLikedProjects, setUserLikedProjects] = useState<string[]>([]);
  const [streak, setStreak] = useState(12); // Default streak for UI demonstration

  const isEditor = !!user;

  // Firebase Realtime Sync
  useEffect(() => {
    const projectsRef = ref(db, 'projects');
    const scheduleRef = ref(db, 'schedule');

    const unsubProjects = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const projectList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        setAllProjects([...PROJECTS, ...projectList.reverse()]);
      }
    });

    const unsubSchedule = onValue(scheduleRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Data is stored as { dayName: [items] }
        const mergedSchedule = WEEKLY_SCHEDULE.map(day => ({
          ...day,
          items: data[day.day] ? [...day.items, ...data[day.day]] : day.items
        }));
        setAllSchedule(getDynamicSchedule(mergedSchedule));
      }
    });

    return () => {
      unsubProjects();
      unsubSchedule();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'Anonymous',
          picture: firebaseUser.photoURL || '',
          sub: firebaseUser.uid
        });
        setShowLogin(false);
      } else {
        setUser(null);
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const todayName = useMemo(() => new Date().toLocaleDateString('en-US', { weekday: 'long' }), []);
  
  const todayLessons = useMemo(() => {
    const todaySched = allSchedule.find(s => s.day === todayName);
    if (!todaySched) return [];
    
    return todaySched.items
      .filter(item => item.type === 'Workshop' || item.type === 'CCA')
      .map(item => {
        const sourceLesson = allLessons.find(l => l.id === item.lessonId);
        const sourceProject = allProjects.find(p => p.id === item.lessonId);
        return {
          id: item.lessonId || `manual-${item.title}`,
          title: item.title,
          category: sourceLesson?.category || sourceProject?.category || 'General Workshop',
          difficulty: sourceLesson?.difficulty || Difficulty.BEGINNER,
          duration: sourceLesson?.duration || '60 mins',
          description: item.description,
          projectGoal: sourceLesson?.projectGoal || sourceProject?.fullDescription || item.description,
          imageUrl: item.imageUrl || sourceLesson?.imageUrl || sourceProject?.imageUrl || '',
          storySteps: sourceLesson?.storySteps || sourceProject?.steps || [
            { title: 'Goal Setting', content: item.description, icon: 'fa-bullseye' },
            { title: 'Project Implementation', content: 'Hands-on development phase.', icon: 'fa-screwdriver-wrench' },
            { title: 'Final Review', content: 'Testing and documenting results.', icon: 'fa-circle-check' }
          ]
        } as Lesson;
      });
  }, [allSchedule, allLessons, allProjects, todayName]);

  // Calculate Dynamic Productivity
  const productivity = useMemo(() => {
    if (todayLessons.length === 0) return 0;
    const completedCount = todayLessons.filter(l => completedToday.includes(l.id)).length;
    return Math.round((completedCount / todayLessons.length) * 100);
  }, [todayLessons, completedToday]);

  const handleCompleteLesson = async (lesson: Lesson) => {
    if (!completedToday.includes(lesson.id)) {
      setCompletedToday(prev => [...prev, lesson.id]);
      setTotalXP(prev => prev + 50);
      setActivityLog(prev => [
        {
          id: `log-${Date.now()}`,
          title: lesson.title,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);
    }
    
    // Auto-publish project to Firebase on completion if logged in
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
      const projectsRef = ref(db, 'projects');
      await push(projectsRef, newProject);
    }

    setIsLearningMode(false);
    setLearningLesson(null);
  };

  const handleAddScheduleItem = async (dayName: string, item: ScheduleItem) => {
    if (!isEditor) return;
    const scheduleDayRef = ref(db, `schedule/${dayName}`);
    const currentDay = allSchedule.find(d => d.day === dayName);
    const existingDbItems = currentDay ? currentDay.items.filter(i => !WEEKLY_SCHEDULE.find(wd => wd.day === dayName)?.items.some(wi => wi.title === i.title)) : [];
    
    await set(scheduleDayRef, [...existingDbItems, item]);
  };

  const handleProjectSubmit = async (project: Project) => {
    const projectsRef = ref(db, 'projects');
    await push(projectsRef, project);
    setIsCreatingProject(false);
  };

  const renderContent = () => {
    if (isLearningMode && learningLesson) {
      const idx = allLessons.findIndex(l => l.id === learningLesson.id);
      return (
        <LessonPathDetail 
          lesson={learningLesson}
          currentLevelIndex={idx === -1 ? 0 : idx} 
          onNext={() => {}} 
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
          onToggleLike={() => {
            const projectId = selectedProject.id;
            const isCurrentlyLiked = userLikedProjects.includes(projectId);
            setAllProjects(prev => prev.map(p => p.id === projectId ? { ...p, likes: isCurrentlyLiked ? p.likes - 1 : p.likes + 1 } : p));
            setUserLikedProjects(prev => isCurrentlyLiked ? prev.filter(id => id !== projectId) : [...prev, projectId]);
          }}
        />
      );
    }

    switch (activeTab) {
      case 'Lab Layout': return (
        <LabLayoutView 
          onEnroll={(l) => { setLearningLesson(l); setIsLearningMode(true); }} 
          todayLessons={todayLessons}
          completedToday={completedToday}
          totalXP={totalXP}
          productivity={productivity}
          streak={streak}
          activityLog={activityLog}
          isEditor={isEditor}
        />
      );
      case 'Schedule': return (
        <ScheduleView 
          schedule={allSchedule} 
          projects={allProjects}
          lessons={allLessons}
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
          onToggleLike={(projectId) => {
            const isCurrentlyLiked = userLikedProjects.includes(projectId);
            setAllProjects(prev => prev.map(p => p.id === projectId ? { ...p, likes: isCurrentlyLiked ? p.likes - 1 : p.likes + 1 } : p));
            setUserLikedProjects(prev => isCurrentlyLiked ? prev.filter(id => id !== projectId) : [...prev, projectId]);
          }}
        />
      );
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#f3f1ff] flex items-center justify-center">
        <i className="fa-solid fa-circle-notch animate-spin text-indigo-500 text-4xl"></i>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f1ff] pb-32 grid-bg">
      {showLogin && <LoginScreen onBack={() => setShowLogin(false)} />}
      
      <header className={`pt-12 px-8 max-w-[1400px] mx-auto transition-all duration-700 ${isLearningMode || selectedProject ? 'opacity-0 -translate-y-full absolute' : 'opacity-100 translate-y-0'}`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-xl border border-white flex items-center justify-center p-3">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStOQQrCJ8rmaj-TLbkMU6TFRj2XsSLnDXzEQ&s" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Design Maker Lab</h1>
              <div className="flex items-center gap-3 mt-1">
                 <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Mastery Workspace</span>
                 <div className="w-1.5 h-1.5 bg-indigo-200 rounded-full"></div>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isEditor ? 'Staff Console' : 'Guest Viewer'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {user ? (
               <div className="flex items-center gap-4">
                 <div className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-full border border-white shadow-lg flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                       <div className="text-[10px] font-black text-slate-900 leading-none">{user.name}</div>
                       <div className="text-[8px] font-black text-indigo-400 mt-1 uppercase tracking-tighter">{user.email}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-indigo-100 p-0.5 shadow-sm overflow-hidden">
                       {user.picture ? <img src={user.picture} alt={user.name} className="w-full h-full rounded-full object-cover" /> : <div className="w-full h-full rounded-full bg-indigo-50 flex items-center justify-center text-indigo-300"><i className="fa-solid fa-user text-xs"></i></div>}
                    </div>
                 </div>
                 <button onClick={() => signOut(auth)} className="w-12 h-12 rounded-2xl bg-white border border-white flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all shadow-lg active:scale-90"><i className="fa-solid fa-right-from-bracket"></i></button>
               </div>
             ) : (
               <button 
                 onClick={() => setShowLogin(true)}
                 className="px-8 py-4 bg-slate-950 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center gap-3"
               >
                 <i className="fa-solid fa-user-lock"></i>
                 Login to Lab
               </button>
             )}
          </div>
        </div>

        {/* PILL NAVIGATION TABS */}
        <div className="flex items-center justify-center mt-6">
          <nav className="bg-[#1e293b] p-2 pill-nav flex items-center gap-1 shadow-2xl">
            {[
              { id: 'Lab Layout', label: 'Lab Layout', icon: 'fa-cube' },
              { id: 'Schedule', label: 'Schedule', icon: 'fa-calendar-days' },
              { id: 'Project Gallery', label: 'Project Gallery', icon: 'fa-shapes' }
            ].map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as any)} 
                className={`px-8 py-3.5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2.5 transition-all ${activeTab === tab.id ? 'bg-[#ffde59] text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <i className={`fa-solid ${tab.icon} text-xs`}></i>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-8 mt-12">
        <div className={`bg-white rounded-organic shadow-2xl border border-white/50 min-h-[750px] overflow-hidden ${isLearningMode || selectedProject ? 'p-0' : 'p-12 md:p-16'}`}>
          {renderContent()}
        </div>
      </main>

      {isCreatingProject && isEditor && <ProjectCreationModal onClose={() => setIsCreatingProject(false)} onSubmit={handleProjectSubmit} />}
      <AIAssistant />
    </div>
  );
};

export default App;
