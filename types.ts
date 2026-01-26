
export enum Difficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  HARD = 'Hard'
}

export type TabType = 'Lab Layout' | 'Schedule' | 'Project Gallery';

export interface LessonStep {
  title: string;
  content: string;
  icon: string;
}

export interface Lesson {
  id: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  duration: string;
  description: string;
  projectGoal: string;
  imageUrl: string;
  author?: string;
  publishedDate?: string;
  tags?: string[];
  storySteps?: LessonStep[];
}

export interface Material {
  id: string;
  name: string;
  category: string;
  quantity: string;
  status: 'In Stock' | 'Low Stock';
  imageUrl: string;
  externalUrl: string;
  description?: string;
  commonUses?: string[];
  icon?: string;
}

export interface ProjectMaterial {
  name: string;
  quantity: string;
  icon?: string;
}

export interface Project {
  id: string;
  title: string;
  student: string;
  grade: string;
  category: string;
  description: string;
  fullDescription?: string; // Detailed narrative
  materials?: ProjectMaterial[]; // Hardware/Materials list
  steps?: LessonStep[]; // Build steps
  likes: number;
  imageUrl: string;
  award?: string;
}

export interface ScheduleItem {
  type: 'Recess Time' | 'CCA' | 'Workshop' | 'Competition' | 'Exhibition';
  title: string;
  time: string;
  audience: string;
  description: string;
  instructor?: string;
  lessonId?: string;
  imageUrl?: string;
}

export interface DaySchedule {
  day: string;
  date: string;
  items: ScheduleItem[];
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
