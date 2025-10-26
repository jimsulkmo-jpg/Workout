
import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="sticky top-0 z-10 bg-white/70 dark:bg-gray-950/70 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
      </div>
    </header>
  );
};

export default Header;
   