import React, { useState } from 'react';
import { WorkoutSet, WorkoutItem, ExerciseItem, RestItem } from '../types';
import { PlusIcon, FireIcon, BarbellIcon, ZzzIcon, TrashIcon } from './icons/Icons';
import Modal from './Modal';

interface WorkoutSetsProps {
  sets: WorkoutSet[];
  addWorkoutSet: (set: Omit<WorkoutSet, 'id'>) => void;
  deleteWorkoutSet: (id: string) => void;
}

const availableCategories = ['Strength', 'Upper Body', 'Lower Body', 'Core', 'Cardio', 'Flexibility'];

const WorkoutSets: React.FC<WorkoutSetsProps> = ({ sets, addWorkoutSet, deleteWorkoutSet }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSetName, setNewSetName] = useState('');
    const [newWorkoutItems, setNewWorkoutItems] = useState<(Omit<ExerciseItem, 'id'> | Omit<RestItem, 'id'>)[]>([
        { type: 'exercise', name: '', sets: 3, reps: 10, categories: [] }
    ]);

    const handleAddExercise = () => {
        setNewWorkoutItems([...newWorkoutItems, { type: 'exercise', name: '', sets: 3, reps: 10, categories: [] }]);
    };
    
    const handleAddRest = () => {
        setNewWorkoutItems([...newWorkoutItems, { type: 'rest', duration: 60 }]);
    };
    
    const handleItemChange = (index: number, field: string, value: string | number) => {
        const updatedItems = [...newWorkoutItems];
        const item = updatedItems[index];

        if (item.type === 'exercise') {
            if (field === 'name') item.name = value as string;
            else if (field === 'sets' || field === 'reps') {
                const numValue = parseInt(value as string, 10);
                item[field] = isNaN(numValue) || numValue < 0 ? 0 : numValue;
            }
        } else if (item.type === 'rest') {
            if (field === 'duration') {
                const numValue = parseInt(value as string, 10);
                item.duration = isNaN(numValue) || numValue < 0 ? 0 : numValue;
            }
        }
        setNewWorkoutItems(updatedItems);
    };

    const handleCategoryToggle = (itemIndex: number, category: string) => {
        const updatedItems = [...newWorkoutItems];
        const item = updatedItems[itemIndex];
        if (item.type !== 'exercise') return;

        const currentCategories = item.categories;
        const categoryIndex = currentCategories.indexOf(category);

        if (categoryIndex > -1) {
            currentCategories.splice(categoryIndex, 1);
        } else {
            currentCategories.push(category);
        }
        setNewWorkoutItems(updatedItems);
    };

    const handleRemoveItem = (index: number) => {
        setNewWorkoutItems(newWorkoutItems.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (newSetName.trim() && newWorkoutItems.length > 0) {
            const itemsWithIds = newWorkoutItems
                .filter(item => {
                    if (item.type === 'exercise') return item.name.trim() !== '' && item.sets > 0 && item.reps > 0 && item.categories.length > 0;
                    if (item.type === 'rest') return item.duration > 0;
                    return false;
                })
                .map((item, index) => ({ ...item, id: `item-new-${Date.now()}-${index}` }));

            if (itemsWithIds.length > 0) {
                addWorkoutSet({
                    name: newSetName,
                    items: itemsWithIds as WorkoutItem[]
                });
                setIsModalOpen(false);
                setNewSetName('');
                setNewWorkoutItems([{ type: 'exercise', name: '', sets: 3, reps: 10, categories: [] }]);
            }
        }
    };
    
    const handleDeleteSet = (id: string) => {
        if (window.confirm('Are you sure you want to delete this set? This will also remove all logged sessions for this workout.')) {
            deleteWorkoutSet(id);
        }
    };
    
    const renderItem = (item: WorkoutItem) => {
        if (item.type === 'exercise') {
             return (
                <li key={item.id} className="flex flex-col items-start text-gray-300 text-sm py-2 border-b border-gray-700/50 last:border-b-0">
                    <div className="flex justify-between items-center w-full">
                        <span className="font-medium">{item.name}</span>
                        <span className="font-mono bg-gray-700 px-2 py-1 rounded-md text-gray-400 text-xs">
                            {item.sets} &times; {item.reps} {item.name.toLowerCase().includes('plank') ? 's' : ''}
                        </span>
                    </div>
                    {item.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {item.categories.map(cat => (
                                <span key={cat} className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-300 font-medium">
                                    {cat}
                                </span>
                            ))}
                        </div>
                    )}
                </li>
            )
        } else {
            return (
                <li key={item.id} className="flex justify-between items-center text-gray-400 text-sm py-2 border-b border-gray-700/50 last:border-b-0">
                    <div className="flex items-center gap-2">
                        <ZzzIcon className="w-4 h-4 text-green-400" />
                        <span className="font-medium text-green-300">Rest</span>
                    </div>
                    <span className="font-mono text-xs">{item.duration} seconds</span>
                </li>
            )
        }
    }

  return (
    <div className="pt-6 space-y-6">
      {sets.length === 0 ? (
         <div className="text-center py-20 px-6 bg-gray-800 rounded-2xl border border-dashed border-gray-700">
            <BarbellIcon className="mx-auto h-12 w-12 text-gray-600" />
            <h3 className="mt-4 text-lg font-semibold text-gray-200">Your Workout Slate is Clean</h3>
            <p className="mt-2 text-sm text-gray-400">Time to build some muscle! Create your first workout set by tapping the '+' button below.</p>
        </div>
      ) : (
        sets.map(set => (
          <div key={set.id} className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden card-enter">
            <div className="p-5 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <FireIcon className="w-5 h-5 text-blue-400 mr-3" />
                        <h3 className="font-bold text-lg text-gray-100">{set.name}</h3>
                    </div>
                    <button onClick={() => handleDeleteSet(set.id)} className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-gray-700 transition-colors">
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                </div>
                <ul className="space-y-3">
                    {set.items.map(renderItem)}
                </ul>
            </div>
          </div>
        ))
      )}

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-1/2 translate-x-[11rem] z-20 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-transform duration-200 ease-in-out active:scale-95"
      >
        <PlusIcon />
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Set">
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 -mr-2">
            <div>
                <label htmlFor="setName" className="block text-sm font-medium text-gray-400 mb-2">Set Name</label>
                <input
                    id="setName"
                    type="text"
                    value={newSetName}
                    onChange={(e) => setNewSetName(e.target.value)}
                    placeholder="e.g., Full Body Friday"
                    className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-400">Items</h4>
                {newWorkoutItems.map((item, index) => (
                    <div key={index} className="flex flex-col gap-2 p-3 bg-gray-700/50 rounded-lg">
                       {item.type === 'exercise' ? (
                         <>
                            <div className="flex items-center gap-2">
                                <div className="flex-grow">
                                    <input type="text" placeholder="Exercise Name" value={item.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)} className="w-full text-sm bg-transparent focus:outline-none placeholder-gray-500" />
                                </div>
                                <input type="number" value={item.sets} onChange={(e) => handleItemChange(index, 'sets', e.target.value)} className="w-16 text-center text-sm bg-gray-600 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                <span className="text-sm text-gray-500">x</span>
                                <input type="number" value={item.reps} onChange={(e) => handleItemChange(index, 'reps', e.target.value)} className="w-16 text-center text-sm bg-gray-600 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                <button onClick={() => handleRemoveItem(index)} className="text-gray-500 hover:text-red-500 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors">&times;</button>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-600/50">
                                {availableCategories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => handleCategoryToggle(index, category)}
                                        className={`px-2 py-1 text-xs rounded-full transition-colors ${
                                            item.categories.includes(category) 
                                            ? 'bg-blue-500 text-white font-semibold' 
                                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                         </>
                       ) : (
                         <div className="flex items-center gap-2">
                            <ZzzIcon className="w-5 h-5 text-green-400" />
                            <span className="flex-grow font-medium text-green-300">Rest</span>
                            <input type="number" value={item.duration} onChange={(e) => handleItemChange(index, 'duration', e.target.value)} className="w-24 text-center text-sm bg-gray-600 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <span className="text-sm text-gray-400">seconds</span>
                            <button onClick={() => handleRemoveItem(index)} className="text-gray-500 hover:text-red-500 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors">&times;</button>
                         </div>
                       )}
                    </div>
                ))}
                 <div className="flex gap-2">
                    <button onClick={handleAddExercise} className="w-full text-sm font-semibold py-2.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
                        Add Exercise
                    </button>
                    <button onClick={handleAddRest} className="w-full text-sm font-semibold py-2.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors">
                        Add Rest
                    </button>
                </div>
            </div>
        </div>
        <div className="mt-6 flex gap-3">
            <button onClick={() => setIsModalOpen(false)} className="w-full bg-gray-700 text-white font-bold py-3 rounded-lg hover:bg-gray-600 transition-colors">
                Cancel
            </button>
            <button onClick={handleSubmit} className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-800 disabled:text-gray-400" disabled={!newSetName.trim() || newWorkoutItems.every(i => i.type === 'exercise' && (!i.name.trim() || i.categories.length === 0))}>
                Save Set
            </button>
        </div>
      </Modal>
    </div>
  );
};

export default WorkoutSets;