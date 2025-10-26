import React, { useState } from 'react';
import { WorkoutSession, WorkoutSet } from '../types';
import { CalendarIcon, ClockIcon, PlusIcon, TrashIcon } from './icons/Icons';
import Modal from './Modal';

interface WorkoutSessionsProps {
  sessions: WorkoutSession[];
  workoutSets: WorkoutSet[];
  addSession: (session: Omit<WorkoutSession, 'id'>) => void;
  deleteSession: (id: string) => void;
}

const WorkoutSessions: React.FC<WorkoutSessionsProps> = ({ sessions, workoutSets, addSession, deleteSession }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSetId, setSelectedSetId] = useState<string>(workoutSets[0]?.id || '');
    const [duration, setDuration] = useState<number>(45);
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const handleSubmit = () => {
        const selectedSet = workoutSets.find(s => s.id === selectedSetId);
        if (selectedSet && duration > 0) {
            addSession({
                setId: selectedSet.id,
                setName: selectedSet.name,
                date,
                duration
            });
            setIsModalOpen(false);
            setDuration(45);
            setDate(new Date().toISOString().split('T')[0]);
        }
    }
    
    const handleDeleteSession = (id: string) => {
        if (window.confirm('Are you sure you want to delete this workout session?')) {
            deleteSession(id);
        }
    };

  return (
    <div className="pt-6 space-y-4">
      {sessions.length === 0 ? (
         <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">No workout sessions logged yet.</p>
            <p className="text-gray-500 dark:text-gray-400">Tap the '+' button to log your first session!</p>
        </div>
      ) : (
        sessions.map(session => (
          <div key={session.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 shadow-sm relative">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-blue-600 dark:text-blue-400 pr-8">{session.setName}</h3>
                <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    <span>{new Date(session.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{session.duration} min</span>
              </div>
            </div>
            <button 
              onClick={() => handleDeleteSession(session.id)} 
              className="absolute top-3 right-3 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
                <TrashIcon className="w-4 h-4"/>
            </button>
          </div>
        ))
      )}

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-1/2 translate-x-[11rem] z-20 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-transform duration-200 ease-in-out active:scale-95"
      >
        <PlusIcon />
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Workout Session">
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Workout Set</label>
                <select 
                    value={selectedSetId}
                    onChange={(e) => setSelectedSetId(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {workoutSets.map(set => (
                        <option key={set.id} value={set.id}>{set.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (minutes)</label>
                <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <button onClick={handleSubmit} className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors">
                Log Session
            </button>
        </div>
      </Modal>

    </div>
  );
};

export default WorkoutSessions;