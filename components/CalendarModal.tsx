
import React, { useState } from 'react';
import { useLimud } from '../hooks/useLimudState';
import { getDaysInMonth, formatYYYYMMDD } from '../services/dateService';
import Icon from './Icon';
import { DailyHistory } from '../types';

interface CalendarModalProps {
    onClose: () => void;
}

const DayDetailModal: React.FC<{ date: Date, dailyHistory: DailyHistory, onClose: () => void }> = ({ date, dailyHistory, onClose }) => {
    const subjects = Object.values(dailyHistory);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-gray-700 rounded-lg shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <header className="p-3 border-b border-gray-600">
                    <h3 className="font-bold text-lg text-center text-white">{date.toLocaleDateString('he-IL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                </header>
                <div className="p-4 max-h-60 overflow-y-auto">
                    {subjects.length > 0 ? (
                        <ul className="space-y-2">
                            {subjects.map((entry, index) => (
                                <li key={index} className="flex justify-between items-center text-sm">
                                    <span className="font-semibold text-gray-200">{entry.name}</span>
                                    <div className="flex items-center">
                                        <span className={`font-mono ${entry.done ? 'text-green-400' : 'text-gray-400'}`}>
                                            {entry.minutes}/{entry.target} דקות
                                        </span>
                                        {entry.done ? <Icon name="check" className="w-4 h-4 text-green-400 mr-2" /> : <Icon name="x" className="w-4 h-4 text-red-400 mr-2" />}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 text-center">אין נתונים עבור יום זה.</p>
                    )}
                </div>
            </div>
        </div>
    );
};


const CalendarModal: React.FC<CalendarModalProps> = ({ onClose }) => {
    const { state } = useLimud();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    
    const Hebcal = window.Hebcal?.Hebcal;
    const HDate = window.Hebcal?.HDate;

    const changeMonth = (delta: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + delta);
            return newDate;
        });
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonthDate = new Date(year, month, 1);
    const firstDayOfMonth = firstDayOfMonthDate.getDay();
    const lastDayOfMonthDate = new Date(year, month + 1, 0);

    const todayKey = formatYYYYMMDD(new Date());
    
    let hebrewMonthStr = '';
    if (HDate && Hebcal) {
        const hFirst = new HDate(firstDayOfMonthDate);
        const hLast = new HDate(lastDayOfMonthDate);
        
        const firstHebMonthName = hFirst.getMonthName('h');
        const lastHebMonthName = hLast.getMonthName('h');
        const hebrewYear = hFirst.getFullYear();
        const hebrewYearStr = Hebcal.gematriya(hebrewYear);

        if (firstHebMonthName === lastHebMonthName) {
            hebrewMonthStr = `${firstHebMonthName} ${hebrewYearStr}`;
        } else {
            hebrewMonthStr = `${firstHebMonthName} / ${lastHebMonthName} ${hebrewYearStr}`;
        }
    }


    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
                <header className="p-4 border-b border-gray-700 flex justify-between items-center relative">
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-700"><Icon name="chevronRight" /></button>
                     <div className="text-center">
                        <h2 className="text-xl font-bold text-white">{currentDate.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })}</h2>
                        {hebrewMonthStr && <p className="text-sm text-gray-300">{hebrewMonthStr}</p>}
                    </div>
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-700"><Icon name="chevronLeft" /></button>
                    <button onClick={onClose} className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-700">
                        <Icon name="x" className="w-6 h-6 text-gray-400" />
                    </button>
                </header>
                <div className="p-4 grid grid-cols-7 gap-1 text-center font-semibold text-gray-400 text-sm">
                    {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="p-4 pt-0 grid grid-cols-7 gap-1 flex-grow">
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
                    {daysInMonth.map(day => {
                        const dayKey = formatYYYYMMDD(day);
                        const dayHistory = state.history[dayKey];
                        const historyEntries = dayHistory ? Object.values(dayHistory) : [];
                        const allDone = historyEntries.length > 0 && historyEntries.every(e => e.done);
                        const someDone = historyEntries.length > 0 && historyEntries.some(e => e.done);

                        let bgColor = 'bg-gray-700 hover:bg-gray-600';
                        if (allDone) bgColor = 'bg-green-800 hover:bg-green-700';
                        else if (someDone) bgColor = 'bg-yellow-800 hover:bg-yellow-700';
                        
                        const isToday = dayKey === todayKey;
                        
                        let hebrewDayString = '';
                        if (HDate && Hebcal) {
                            const hDate = new HDate(day);
                            hebrewDayString = Hebcal.gematriya(hDate.getDate());
                        }

                        return (
                            <div key={dayKey} onClick={() => dayHistory && setSelectedDay(day)} className={`h-16 flex flex-col justify-between p-2 rounded-lg cursor-pointer transition-colors ${bgColor} ${isToday ? 'ring-2 ring-cyan-400' : ''}`}>
                               <div className="w-full flex justify-between items-baseline">
                                    <span className="font-bold text-md text-white">{hebrewDayString}</span>
                                    <span className="text-xs text-gray-400">{day.getDate()}</span>
                                </div>
                                <div className="flex justify-center w-full space-x-1 space-x-reverse">
                                    {historyEntries.slice(0, 4).map(entry => (
                                        <div key={entry.name} className={`w-1.5 h-1.5 rounded-full ${entry.done ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {selectedDay && state.history[formatYYYYMMDD(selectedDay)] && (
                <DayDetailModal date={selectedDay} dailyHistory={state.history[formatYYYYMMDD(selectedDay)]} onClose={() => setSelectedDay(null)} />
            )}
        </div>
    );
};

export default CalendarModal;
