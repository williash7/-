
import React from 'react';
import { useLimud } from '../hooks/useLimudState';
import SubjectCard from './SubjectCard';

const SubjectList: React.FC = () => {
    const { state } = useLimud();

    if (state.subjects.length === 0) {
        return (
            <div className="text-center text-gray-400 p-8 bg-gray-800 rounded-lg">
                <p>עדיין לא הוספת מסלולי לימוד.</p>
                <p>לחץ על סמל ההגדרות למעלה כדי להתחיל.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-4">
            {state.subjects.map(subject => (
                <SubjectCard key={subject.id} subject={subject} />
            ))}
        </div>
    );
};

export default SubjectList;
