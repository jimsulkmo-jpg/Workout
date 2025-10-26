import React from 'react';
import { Tab } from '../types';
import { BarbellIcon, ChartIcon, CogIcon, HistoryIcon } from './icons/Icons';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const NavItem: React.FC<{
  label: Tab;
  // FIX: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
  icon: React.ReactElement;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = 'text-blue-500 dark:text-blue-400';
  const inactiveClasses = 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400';
  
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-1/4 transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
    >
      {icon}
      <span className={`text-xs capitalize mt-1 font-medium`}>{label === 'workouts' ? 'Sets' : (label === 'sessions' ? 'History' : label)}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-md w-full bg-white/70 dark:bg-gray-950/70 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-t-lg">
      <div className="flex justify-around items-center h-20">
        <NavItem
          label="workouts"
          icon={<BarbellIcon />}
          isActive={activeTab === 'workouts'}
          onClick={() => setActiveTab('workouts')}
        />
        <NavItem
          label="sessions"
          icon={<HistoryIcon />}
          isActive={activeTab === 'sessions'}
          onClick={() => setActiveTab('sessions')}
        />
        <NavItem
          label="progress"
          icon={<ChartIcon />}
          isActive={activeTab === 'progress'}
          onClick={() => setActiveTab('progress')}
        />
        <NavItem
          label="settings"
          icon={<CogIcon />}
          isActive={activeTab === 'settings'}
          onClick={() => setActiveTab('settings')}
        />
      </div>
    </nav>
  );
};

export default BottomNav;
