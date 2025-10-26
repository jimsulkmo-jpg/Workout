export interface ExerciseItem {
  id: string;
  type: 'exercise';
  name: string;
  sets: number;
  reps: number; // can also be seconds for timed exercises like plank
  categories: string[];
}

export interface RestItem {
  id: string;
  type: 'rest';
  duration: number; // in seconds
}

export type WorkoutItem = ExerciseItem | RestItem;


export interface WorkoutSet {
  id:string;
  name:string;
  items: WorkoutItem[];
}

export interface WorkoutSession {
  id: string;
  setId: string;
  setName: string;
  date: string; // YYYY-MM-DD
  duration: number; // in minutes
}

export interface WeightEntry {
  date: string; // YYYY-MM-DD
  weight: number; // in kg
}

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number; // in kg
  height: number; // in cm
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  fitnessGoal: 'lose' | 'gain' | 'maintain';
  targetWeight?: number; // in kg
  weightHistory?: WeightEntry[];
}

export interface ProgressData {
    subject: string;
    A: number;
    fullMark: number;
}

export type Theme = 'light' | 'dark';
export type Tab = 'workouts' | 'sessions' | 'progress' | 'settings';