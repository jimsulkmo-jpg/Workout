import React, { useState, useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, LineChart, CartesianGrid, XAxis, YAxis, Line } from 'recharts';
import { ProgressData, UserProfile } from '../types';

interface ProgressProps {
  data: ProgressData[];
  profile: UserProfile;
  addWeightEntry: (weight: number) => void;
}

const Progress: React.FC<ProgressProps> = ({ data, profile, addWeightEntry }) => {
  const [newWeight, setNewWeight] = useState(profile.weight.toString());

  const handleUpdateWeight = () => {
    const weightValue = parseFloat(newWeight);
    if (!isNaN(weightValue) && weightValue > 0) {
      addWeightEntry(weightValue);
    }
  };

  const weightHistory = profile.weightHistory || [];

  const processedWeightData = useMemo(() => {
    if (weightHistory.length < 2) {
      return weightHistory.map(entry => ({...entry, up: null, down: null, same: null}));
    }

    const data = weightHistory.map(entry => ({
      date: entry.date,
      weight: entry.weight,
      up: null as number | null,
      down: null as number | null,
      same: null as number | null,
    }));

    for (let i = 1; i < data.length; i++) {
      const prev = data[i - 1];
      const curr = data[i];

      if (curr.weight > prev.weight) {
        prev.up = prev.weight;
        curr.up = curr.weight;
      } else if (curr.weight < prev.weight) {
        prev.down = prev.weight;
        curr.down = curr.weight;
      } else {
        prev.same = prev.weight;
        curr.same = curr.weight;
      }
    }
    return data;
  }, [weightHistory]);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const currentDate = new Date(label).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
      const currentWeight = dataPoint.weight;
      
      const originalIndex = weightHistory.findIndex(d => d.date === dataPoint.date);
      let change = 0;
      if (originalIndex > 0) {
        change = currentWeight - weightHistory[originalIndex - 1].weight;
      }

      return (
        <div className="bg-gray-800/80 backdrop-blur-sm p-3 rounded-lg border border-gray-700 shadow-lg">
          <p className="text-sm text-gray-300 font-semibold">{currentDate}</p>
          <p className="text-xl font-bold text-white">{`${currentWeight.toFixed(1)} kg`}</p>
          {originalIndex > 0 && (
             <p className={`text-sm font-semibold ${change > 0 ? 'text-red-400' : change < 0 ? 'text-green-400' : 'text-gray-400'}`}>
                {change > 0 ? '↑' : change < 0 ? '↓' : '→'} {Math.abs(change).toFixed(1)} kg from previous
             </p>
          )}
        </div>
      );
    }
    return null;
  };


  return (
    <div className="pt-6 space-y-12 pb-8">
      {/* Radar Chart Section */}
      <div className="h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-gray-200">Muscle Group Balance</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
            This chart shows your workout focus progression.
        </p>
        <ResponsiveContainer width="100%" height="80%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <defs>
              <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <PolarGrid stroke="rgba(128, 128, 128, 0.3)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: 'currentColor', fontSize: 12 }} className="text-gray-700 dark:text-gray-300"/>
            <PolarRadiusAxis angle={30} domain={[0, 10]} tickCount={5} tick={{ fill: 'currentColor', fontSize: 10 }} />
            <Radar name="Score" dataKey="A" stroke="#3b82f6" fill="url(#colorA)" fillOpacity={0.6} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                borderColor: '#3b82f6',
                borderRadius: '0.5rem',
                color: '#f1f5f9'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <hr className="border-gray-200 dark:border-gray-700/50" />

      {/* Weight Progress section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">Weight Journey</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Lines turn green for weight loss and red for weight gain.
        </p>
        {weightHistory.length > 1 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={processedWeightData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'currentColor', fontSize: 12 }}
                className="text-gray-500"
                tickFormatter={(str) => {
                  const date = new Date(str);
                  if (isNaN(date.getTime())) return '';
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
                }}
              />
              <YAxis
                tick={{ fill: 'currentColor', fontSize: 12 }}
                className="text-gray-500"
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="down" stroke="#10b981" strokeWidth={3} dot={false} connectNulls={false} />
              <Line type="monotone" dataKey="up" stroke="#ef4444" strokeWidth={3} dot={false} connectNulls={false} />
              <Line type="monotone" dataKey="same" stroke="#6b7280" strokeWidth={3} dot={false} connectNulls={false} />
              <Line dataKey="weight" stroke="none" dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: 'rgba(23,37,84,0.5)' }} activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-10 px-6 bg-gray-800 rounded-2xl border border-dashed border-gray-700">
            <p className="text-gray-400">Log your weight below to start seeing your progress chart.</p>
          </div>
        )}

        <div className="bg-gray-800 rounded-xl p-4 mt-8">
          <h3 className="font-semibold text-lg mb-3 text-gray-200">Log Today's Weight</h3>
          <div className="flex gap-3 items-center">
            <input
              type="number"
              step="0.1"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`e.g., ${profile.weight}`}
            />
            <button
              onClick={handleUpdateWeight}
              disabled={!newWeight || parseFloat(newWeight) <= 0}
              className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-800 disabled:text-gray-400"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;