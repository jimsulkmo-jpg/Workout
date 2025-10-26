import React, { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Tab, Theme, UserProfile, WorkoutSet, WorkoutSession, ProgressData, WorkoutItem, WeightEntry } from './types';
import BottomNav from './components/BottomNav';
import WorkoutSets from './components/WorkoutSets';
import WorkoutSessions from './components/WorkoutSessions';
import Progress from './components/Progress';
import Settings from './components/Settings';
import Header from './components/Header';
import Onboarding from './components/Onboarding';

const calculateProgress = (sessions: WorkoutSession[], workoutSets: WorkoutSet[]): ProgressData[] => {
    const progress: {[key: string]: number} = {
        'Strength': 0.0,
        'Cardio': 0.0,
        'Flexibility': 0.0,
        'Upper Body': 0.0,
        'Lower Body': 0.0,
        'Core': 0.0,
    };
    
    sessions.forEach(session => {
        const workoutSet = workoutSets.find(ws => ws.id === session.setId);
        if (!workoutSet) return;
        
        workoutSet.items.forEach(item => {
            if (item.type === 'exercise') {
                item.categories.forEach(category => {
                    if (progress[category] !== undefined) {
                        progress[category] = Math.min(10.0, progress[category] + 0.1);
                    }
                });
            }
        });
    });

    return Object.entries(progress).map(([subject, A]) => ({
        subject,
        A: parseFloat(A.toFixed(1)),
        fullMark: 10,
    }));
};


const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('workouts');
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'dark');
  const [profile, setProfile] = useLocalStorage<UserProfile>('userProfile', {
    name: 'User',
    age: 25,
    gender: 'other',
    weight: 70,
    height: 175,
    fitnessLevel: 'beginner',
    fitnessGoal: 'maintain',
    weightHistory: [],
  });
  const [workoutSets, setWorkoutSets] = useLocalStorage<WorkoutSet[]>('workoutSets', [
    { id: 'set1', name: 'Full Body Strength', items: [
        {id: 'ex1', type: 'exercise', name: 'Squats', sets: 3, reps: 12, categories: ['Lower Body', 'Strength']}, 
        {id: 'rest1', type: 'rest', duration: 60},
        {id: 'ex2', type: 'exercise', name: 'Push-ups', sets: 3, reps: 15, categories: ['Upper Body', 'Core', 'Strength']},
        {id: 'ex3', type: 'exercise', name: 'Plank', sets: 3, reps: 60, categories: ['Core']}
    ]},
    { id: 'set2', name: 'Upper Body Focus', items: [
        {id: 'ex4', type: 'exercise', name: 'Bicep Curls', sets: 3, reps: 12, categories: ['Upper Body', 'Strength']},
        {id: 'ex5', type: 'exercise', name: 'Tricep Dips', sets: 3, reps: 12, categories: ['Upper Body', 'Strength']}
    ]},
  ]);
  const [sessions, setSessions] = useLocalStorage<WorkoutSession[]>('workoutSessions', [
      { id: 'sess1', setId: 'set1', setName: 'Full Body Strength', date: '2024-07-20', duration: 45 },
      { id: 'sess2', setId: 'set2', setName: 'Upper Body Focus', date: '2024-07-22', duration: 30 },
  ]);
  const [onboardingComplete, setOnboardingComplete] = useLocalStorage('onboardingComplete', false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const addWorkoutSet = (set: Omit<WorkoutSet, 'id'>) => {
    const newSet = { ...set, id: new Date().toISOString() };
    setWorkoutSets(prev => [...prev, newSet]);
  };

  const deleteWorkoutSet = (id: string) => {
    setWorkoutSets(prev => prev.filter(set => set.id !== id));
    setSessions(prev => prev.filter(session => session.setId !== id));
  };

  const addSession = (session: Omit<WorkoutSession, 'id'>) => {
    const newSession = { ...session, id: new Date().toISOString() };
    setSessions(prev => [newSession, ...prev]);
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(session => session.id !== id));
  };
  
  const addWeightEntry = (weight: number) => {
      const newEntry: WeightEntry = { date: new Date().toISOString().split('T')[0], weight };
      setProfile(prevProfile => ({
        ...prevProfile,
        weight: weight, // Update current weight
        weightHistory: [...(prevProfile.weightHistory || []), newEntry] // Add to history
      }));
    };
  
  const handleOnboardingComplete = (newProfile: UserProfile) => {
    const profileWithHistory = {
        ...newProfile,
        weightHistory: [{ date: new Date().toISOString().split('T')[0], weight: newProfile.weight }]
    };
    setProfile(profileWithHistory);
    setOnboardingComplete(true);
  };

  const progressData = useMemo(() => calculateProgress(sessions, workoutSets), [sessions, workoutSets]);
  
  if (!onboardingComplete || !profile.fitnessLevel || !profile.fitnessGoal) {
    return (
       <div className="bg-gray-100 dark:bg-black min-h-screen font-sans">
          <Onboarding onComplete={handleOnboardingComplete} />
       </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'workouts':
        return <WorkoutSets sets={workoutSets} addWorkoutSet={addWorkoutSet} deleteWorkoutSet={deleteWorkoutSet} />;
      case 'sessions':
        return <WorkoutSessions sessions={sessions} workoutSets={workoutSets} addSession={addSession} deleteSession={deleteSession} />;
      case 'progress':
        return <Progress data={progressData} profile={profile} addWeightEntry={addWeightEntry} />;
      case 'settings':
        return <Settings profile={profile} setProfile={setProfile} theme={theme} setTheme={setTheme} />;
      default:
        return <WorkoutSets sets={workoutSets} addWorkoutSet={addWorkoutSet} deleteWorkoutSet={deleteWorkoutSet} />;
    }
  };
  
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'workouts': return 'Your Workout Sets';
      case 'sessions': return 'Workout Sessions';
      case 'progress': return 'Your Progress';
      case 'settings': return 'Settings';
      default: return 'Workout Tracker';
    }
  }

  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen font-sans text-gray-900 dark:text-gray-100">
      <div className="max-w-md mx-auto h-screen flex flex-col bg-white dark:bg-gray-900/80 backdrop-blur-sm shadow-2xl">
        <Header title={getHeaderTitle()} />
        <main className="flex-grow overflow-y-auto pb-24 px-4">
          {renderContent()}
        </main>
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

export default App;