
import React, { useMemo } from 'react';
import { useLimud } from '../hooks/useLimudState';
import { Subject } from '../types';
import Icon from './Icon';
import { formatYYYYMMDD } from '../services/dateService';

interface SubjectCardProps {
    subject: Subject;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
    const { state, dispatch } = useLimud();
    const { progress, activeSubjectId, activeSeconds, history } = state;

    const currentProgress = progress[subject.id] || 0;
    const isActive = activeSubjectId === subject.id;
    const isCompleted = currentProgress >= subject.minutes;
    const percentage = subject.minutes > 0 ? Math.min(100, Math.round((currentProgress / subject.minutes) * 100)) : 100;

    const streak = useMemo(() => {
        let count = 0;
        let date = new Date();
        if (isCompleted) {
             // If completed today, start counting from today.
        } else {
            date.setDate(date.getDate() - 1); // Start from yesterday
        }
        
        while (true) {
            const key = formatYYYYMMDD(date);
            const dayHistory = history[key];
            if (dayHistory && dayHistory[subject.id]?.done) {
                count++;
                date.setDate(date.getDate() - 1);
            } else {
                break;
            }
        }
        return count;
    }, [history, subject.id, isCompleted]);

    const handleToggleTimer = () => dispatch({ type: 'TOGGLE_TIMER', payload: { id: subject.id } });
    const handleAddMinute = () => dispatch({ type: 'ADD_MINUTE', payload: { id: subject.id } });
    const handleMarkComplete = () => dispatch({ type: 'MARK_COMPLETE', payload: { id: subject.id, wasCompleted: isCompleted } });

    return (
        <div className={`bg-gray-800 p-4 rounded-lg shadow-md transition-all duration-300 ${isActive ? 'ring-2 ring-emerald-400' : ''}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-white">{subject.name}</h3>
                    <p className="text-sm text-gray-400">
                        {currentProgress}/{subject.minutes} דקות
                        {isActive && <span className="text-emerald-400 font-mono animate-pulse"> • {String(59-activeSeconds).padStart(2, '0')}s</span>}
                    </p>
                </div>
                 {streak > 0 && (
                    <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        רצף: {streak} ימים
                    </div>
                )}
            </div>

            <div className="w-full bg-gray-700 rounded-full h-2.5 my-3">
                <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-emerald-500'}`}
                    style={{ width: `${percentage}%` }}>
                </div>
            </div>

            <div className="flex justify-between items-center space-x-2 space-x-reverse">
                <button onClick={handleToggleTimer} className={`p-3 rounded-full transition-colors ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'} text-white`}>
                    <Icon name={isActive ? 'pause' : 'play'} className="w-5 h-5" />
                </button>
                <div className="flex space-x-2 space-x-reverse">
                    <button onClick={handleAddMinute} className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300" title="+ דקה">
                        <Icon name="plus" className="w-5 h-5" />
                    </button>
                    <button onClick={handleMarkComplete} className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300" title={isCompleted ? "בטל השלמה" : "סמן כהושלם"}>
                       <Icon name={isCompleted ? 'undo' : 'check'} className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubjectCard;
