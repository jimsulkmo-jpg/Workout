import React from 'react';
import { UserProfile, Theme } from '../types';
import { MoonIcon, SunIcon } from './icons/Icons';

interface SettingsProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const Settings: React.FC<SettingsProps> = ({ profile, setProfile, theme, setTheme }) => {
  const handleProfileChange = (field: keyof UserProfile, value: string | number) => {
    setProfile({ ...profile, [field]: value });
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="pt-6 space-y-8">
      {/* Theme Toggle */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
        <h3 className="font-semibold text-lg mb-3">Appearance</h3>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
          <button onClick={toggleTheme} className={`relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-300 focus:outline-none ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}>
            <span className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-300 ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'}`}>
              {theme === 'dark' ? <MoonIcon className="text-blue-600 m-1" /> : <SunIcon className="text-yellow-500 m-1" />}
            </span>
          </button>
        </div>
      </div>
      
      {/* Profile Settings */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
        <h3 className="font-semibold text-lg mb-4">Your Profile</h3>
        <div className="space-y-4">
          <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
              <input type="text" value={profile.name} onChange={(e) => handleProfileChange('name', e.target.value)} className="mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Age</label>
              <input type="number" value={profile.age} onChange={(e) => handleProfileChange('age', parseInt(e.target.value))} className="mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Gender</label>
              <select value={profile.gender} onChange={(e) => handleProfileChange('gender', e.target.value)} className="mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Weight (kg)</label>
              <input type="number" value={profile.weight} onChange={(e) => handleProfileChange('weight', parseFloat(e.target.value))} className="mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Height (cm)</label>
              <input type="number" value={profile.height} onChange={(e) => handleProfileChange('height', parseInt(e.target.value))} className="mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
           <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Fitness Level</label>
              <select value={profile.fitnessLevel} onChange={(e) => handleProfileChange('fitnessLevel', e.target.value)} className="mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;