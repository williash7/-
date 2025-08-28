
import React, { useState } from 'react';
import { useLimud } from '../hooks/useLimudState';
import Icon from './Icon';
import ConfirmationDialog from './ConfirmationDialog';
import { Subject } from '../types';

interface ManageSubjectsModalProps {
    onClose: () => void;
}

const ManageSubjectsModal: React.FC<ManageSubjectsModalProps> = ({ onClose }) => {
    const { state, dispatch } = useLimud();
    const [newName, setNewName] = useState('');
    const [newMinutes, setNewMinutes] = useState(10);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleAddSubject = (e: React.FormEvent) => {
        e.preventDefault();
        if (newName.trim() && newMinutes > 0) {
            dispatch({ type: 'ADD_SUBJECT', payload: { name: newName.trim(), minutes: newMinutes } });
            setNewName('');
            setNewMinutes(10);
        }
    };

    const handleUpdateSubject = (subject: Subject) => {
        dispatch({ type: 'UPDATE_SUBJECT', payload: subject });
    };

    const handleDeleteSubject = (id: string) => {
        dispatch({ type: 'DELETE_SUBJECT', payload: { id } });
    };

    const handleDeleteAll = () => {
        dispatch({ type: 'DELETE_ALL_SUBJECTS' });
        setShowConfirm(false);
    };

    const changeMinutes = (subject: Subject, delta: number) => {
        const minutes = Math.max(1, subject.minutes + delta);
        handleUpdateSubject({ ...subject, minutes });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
                <header className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">ניהול מסלולים</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
                        <Icon name="x" className="w-6 h-6 text-gray-400" />
                    </button>
                </header>

                <div className="p-4 space-y-4 overflow-y-auto flex-grow">
                    {state.subjects.map(subject => (
                        <div key={subject.id} className="bg-gray-700 p-3 rounded-lg flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 sm:space-x-reverse">
                            <input
                                type="text"
                                value={subject.name}
                                onChange={(e) => handleUpdateSubject({ ...subject, name: e.target.value })}
                                className="bg-gray-600 text-white rounded px-2 py-1 w-full sm:flex-grow"
                            />
                            <div className="flex items-center space-x-1 space-x-reverse">
                                <button onClick={() => changeMinutes(subject, -1)} className="p-2 bg-gray-600 rounded-full">-</button>
                                <input
                                    type="number"
                                    value={subject.minutes}
                                    onChange={(e) => handleUpdateSubject({ ...subject, minutes: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                                    className="bg-gray-600 text-white rounded w-16 text-center py-1"
                                />
                                <button onClick={() => changeMinutes(subject, 1)} className="p-2 bg-gray-600 rounded-full">+</button>
                            </div>
                            <button onClick={() => handleDeleteSubject(subject.id)} className="p-2 text-red-400 hover:text-red-300">
                                <Icon name="trash" className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleAddSubject} className="p-4 border-t border-gray-700 space-y-2">
                    <h3 className="font-bold">הוסף מסלול חדש</h3>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 sm:space-x-reverse">
                        <input
                            type="text"
                            placeholder="שם המסלול"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="bg-gray-700 text-white rounded px-3 py-2 flex-grow"
                            required
                        />
                        <input
                            type="number"
                            placeholder="דקות יעד"
                            value={newMinutes}
                            onChange={(e) => setNewMinutes(Math.max(1, parseInt(e.target.value, 10) || 1))}
                            className="bg-gray-700 text-white rounded px-3 py-2 w-full sm:w-24 text-center"
                            min="1"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded transition-colors">
                        הוסף מסלול
                    </button>
                </form>

                <footer className="p-4 border-t border-gray-700">
                    <button onClick={() => setShowConfirm(true)} className="w-full bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 rounded transition-colors">
                        מחק את כל המסלולים
                    </button>
                </footer>
            </div>
            {showConfirm && (
                <ConfirmationDialog
                    title="מחיקת כל המסלולים"
                    message="האם אתה בטוח? פעולה זו תמחק את כל המסלולים לצמיתות. ההיסטוריה תישמר."
                    onConfirm={handleDeleteAll}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </div>
    );
};

export default ManageSubjectsModal;
