import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ArrowsRightLeftIcon, CheckIcon, FemaleIcon, MaleIcon, TrendingDownIcon, TrendingUpIcon, UserIcon } from './icons/Icons';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: 25,
    gender: 'other',
    weight: 70,
    height: 175,
    fitnessLevel: 'beginner',
    fitnessGoal: 'maintain',
  });
  const [error, setError] = useState('');
  
  const baseFlow = ['name', 'gender', 'age', 'weight', 'goal', 'height', 'level'];
  const [flow, setFlow] = useState(baseFlow);
  const [stepIndex, setStepIndex] = useState(0);

  const handleChange = (field: keyof UserProfile, value: string | number | 'lose' | 'gain' | 'maintain') => {
    setError('');
    
    const newProfile = { ...profile };

    if (field === 'fitnessGoal') {
        const newGoal = value as 'lose' | 'gain' | 'maintain';
        newProfile.fitnessGoal = newGoal;
        
        if (newGoal === 'lose' || newGoal === 'gain') {
            if (!newProfile.targetWeight) { // Set a default if not already set
                 newProfile.targetWeight = newGoal === 'lose' 
                    ? Math.max(30, newProfile.weight - 5) 
                    : newProfile.weight + 5;
            }
            setFlow(['name', 'gender', 'age', 'weight', 'goal', 'targetWeight', 'height', 'level']);
        } else { // maintain
            delete newProfile.targetWeight;
            setFlow(baseFlow);
        }
    } else {
        (newProfile as any)[field] = value;
    }

    setProfile(newProfile);
  };


  const handleNext = () => {
    const currentStep = flow[stepIndex];
    if (currentStep === 'name' && profile.name.trim().length < 2) {
      setError('Please enter your name.');
      return;
    }
    setError('');
    setDirection('forward');
    if (stepIndex < flow.length - 1) {
      setStepIndex(s => s + 1);
    } else {
      onComplete(profile);
    }
  };

  const handleBack = () => {
    setError('');
    setDirection('backward');
    if (stepIndex > 0) {
      setStepIndex(s => s - 1);
    }
  };

  const renderStepContent = () => {
    const currentStep = flow[stepIndex];
    const key = `${currentStep}-${direction}`;
    const animationClass = direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left';
    
    switch (currentStep) {
      case 'name':
        return (
          <div key={key} className={animationClass}>
            <h2 className="text-3xl font-bold text-center text-gray-100">What should we call you?</h2>
            <p className="text-center text-gray-400 mt-2">Let's get personal.</p>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Your Name"
              className="mt-8 w-full bg-gray-800/50 border-b-2 border-gray-600 focus:border-blue-500 rounded-t-lg p-4 text-center text-xl text-white focus:outline-none transition-colors"
              autoFocus
            />
          </div>
        );
      case 'gender':
        return (
          <div key={key} className={animationClass}>
            <h2 className="text-3xl font-bold text-center text-gray-100">Hi, {profile.name}!</h2>
            <p className="text-center text-gray-400 mt-2">Tell us a bit about you.</p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {(['male', 'female', 'other'] as const).map(g => (
                <button key={g} onClick={() => handleChange('gender', g)} 
                  className={`py-6 rounded-2xl flex flex-col items-center justify-center gap-3 font-semibold transition-all duration-200 transform hover:scale-105 ${profile.gender === g ? 'bg-blue-500 text-white ring-2 ring-offset-2 ring-offset-black ring-blue-500' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
                  {g === 'male' && <MaleIcon className="w-8 h-8"/>}
                  {g === 'female' && <FemaleIcon className="w-8 h-8"/>}
                  {g === 'other' && <UserIcon className="w-8 h-8"/>}
                  <span className="capitalize">{g}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 'age':
        return (
          <div key={key} className={animationClass}>
            <h2 className="text-3xl font-bold text-center text-gray-100">How old are you?</h2>
            <div className="mt-8 text-center">
                <span className="text-6xl font-bold text-blue-400">{profile.age}</span>
            </div>
            <input
              type="range"
              min="13"
              max="99"
              value={profile.age}
              onChange={(e) => handleChange('age', parseInt(e.target.value))}
              className="mt-8 w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        );
      case 'weight':
         return (
          <div key={key} className={animationClass}>
            <h2 className="text-3xl font-bold text-center text-gray-100">What's your weight?</h2>
            <div className="mt-8 text-center">
                <span className="text-6xl font-bold text-blue-400">{profile.weight}</span>
                <span className="text-xl text-gray-400 ml-2">kg</span>
            </div>
            <input
              type="range"
              min="30"
              max="200"
              step="0.5"
              value={profile.weight}
              onChange={(e) => handleChange('weight', parseFloat(e.target.value))}
              className="mt-8 w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        );
       case 'goal':
        return (
          <div key={key} className={animationClass}>
            <h2 className="text-3xl font-bold text-center text-gray-100">What's your primary goal?</h2>
            <p className="text-center text-gray-400 mt-2">This helps tailor your experience.</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {([
                { id: 'lose', icon: <TrendingDownIcon className="w-8 h-8" />, label: 'Lose Weight' },
                { id: 'gain', icon: <TrendingUpIcon className="w-8 h-8" />, label: 'Gain Weight' },
                { id: 'maintain', icon: <ArrowsRightLeftIcon className="w-8 h-8" />, label: 'Maintain' },
              ] as const).map(goal => (
                <button key={goal.id} onClick={() => handleChange('fitnessGoal', goal.id)}
                  className={`py-6 rounded-2xl flex flex-col items-center justify-center gap-3 font-semibold transition-all duration-200 transform hover:scale-105 ${profile.fitnessGoal === goal.id ? 'bg-blue-500 text-white ring-2 ring-offset-2 ring-offset-black ring-blue-500' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
                  {goal.icon}
                  <span>{goal.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 'targetWeight':
        return (
          <div key={key} className={animationClass}>
            <h2 className="text-3xl font-bold text-center text-gray-100">Set your target weight</h2>
            <div className="mt-8 text-center">
                <span className="text-6xl font-bold text-blue-400">{profile.targetWeight || profile.weight}</span>
                <span className="text-xl text-gray-400 ml-2">kg</span>
            </div>
            <input
              type="range"
              min={profile.fitnessGoal === 'lose' ? 30 : profile.weight}
              max={profile.fitnessGoal === 'lose' ? profile.weight : 200}
              step="0.5"
              value={profile.targetWeight}
              onChange={(e) => handleChange('targetWeight', parseFloat(e.target.value))}
              className="mt-8 w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        );
      case 'height':
        return (
          <div key={key} className={animationClass}>
            <h2 className="text-3xl font-bold text-center text-gray-100">And your height?</h2>
            <div className="mt-8 text-center">
                <span className="text-6xl font-bold text-blue-400">{profile.height}</span>
                <span className="text-xl text-gray-400 ml-2">cm</span>
            </div>
            <input
              type="range"
              min="120"
              max="230"
              value={profile.height}
              onChange={(e) => handleChange('height', parseInt(e.target.value))}
              className="mt-8 w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        );
      case 'level':
        return (
          <div key={key} className={animationClass}>
            <h2 className="text-3xl font-bold text-center text-gray-100">What's your fitness level?</h2>
             <p className="text-center text-gray-400 mt-2">This helps us suggest workouts later.</p>
            <div className="mt-8 space-y-4">
              {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
                <button key={level} onClick={() => handleChange('fitnessLevel', level)} className={`w-full text-left p-4 rounded-xl font-semibold transition-all duration-200 border-2  ${profile.fitnessLevel === level ? 'bg-blue-500/10 border-blue-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="capitalize text-lg">{level}</p>
                      <p className="text-sm font-normal normal-case text-gray-400 mt-1">
                        {level === 'beginner' && 'Just starting out or getting back into it.'}
                        {level === 'intermediate' && 'You work out regularly and are comfortable.'}
                        {level === 'advanced' && 'You have specific goals and are experienced.'}
                      </p>
                    </div>
                    {profile.fitnessLevel === level && <CheckIcon className="w-6 h-6 text-blue-400"/>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-black text-white font-sans overflow-hidden">
      <div className="w-full max-w-md">
        <div className="w-full bg-gray-700 rounded-full h-2 mb-8">
          <div className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-in-out" style={{ width: `${((stepIndex + 1) / flow.length) * 100}%` }}></div>
        </div>

        <div className="flex flex-col justify-between" style={{ minHeight: '60vh' }}>
            <div className="flex-grow flex flex-col justify-center">
              {renderStepContent()}
              {error && <p className="text-red-400 text-sm text-center mt-4 animate-head-shake">{error}</p>}
            </div>

            <div className="flex items-center gap-4 mt-8">
              {stepIndex > 0 && (
                <button
                  onClick={handleBack}
                  className="bg-transparent text-gray-400 font-bold py-3 px-4 rounded-lg hover:text-white transition-colors duration-300"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex-grow bg-blue-600 text-white font-bold py-4 px-4 rounded-xl hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transform active:scale-95"
              >
                {stepIndex === flow.length - 1 ? 'Finish Setup' : 'Continue'}
              </button>
            </div>
        </div>
      </div>
      <style>
        {`
            @keyframes slide-in-right {
                from { opacity: 0; transform: translateX(30px); }
                to { opacity: 1; transform: translateX(0); }
            }
             @keyframes slide-in-left {
                from { opacity: 0; transform: translateX(-30px); }
                to { opacity: 1; transform: translateX(0); }
            }
            .animate-slide-in-right {
                animation: slide-in-right 0.4s ease-out forwards;
            }
             .animate-slide-in-left {
                animation: slide-in-left 0.4s ease-out forwards;
            }
            @keyframes head-shake {
              0% { transform: translateX(0); }
              25% { transform: translateX(-4px); }
              50% { transform: translateX(4px); }
              75% { transform: translateX(-4px); }
              100% { transform: translateX(0); }
            }
            .animate-head-shake {
              animation: head-shake 0.3s ease-in-out;
            }
        `}
      </style>
    </div>
  );
};

export default Onboarding;