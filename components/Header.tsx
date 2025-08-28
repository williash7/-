
import React from 'react';
import { useLimud } from '../hooks/useLimudState';
import Icon from './Icon';

interface HeaderProps {
    onManageClick: () => void;
    onCalendarClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onManageClick, onCalendarClick }) => {
    const { state, dispatch } = useLimud();
    const { hebrewDateInfo, subjects, progress, soundOn, autoReset } = state;
    
    const totalGoal = subjects.reduce((sum, s) => sum + s.minutes, 0);
    const totalDone = Object.values(progress).reduce((sum, p) => sum + p, 0);
    const overallPercentage = totalGoal > 0 ? Math.round((totalDone / totalGoal) * 100) : 0;

    return (
        <header className="bg-gray-800 rounded-lg p-4 shadow-lg space-y-3">
            <div className="text-center text-lg font-bold text-cyan-300">
                <span>{hebrewDateInfo.weekdayLabel}</span>
                <span className="mx-2">·</span>
                <span>{hebrewDateInfo.hebrewDateLabel}</span>
                {hebrewDateInfo.parasha && (
                    <>
                        <span className="mx-2">·</span>
                        <span>פרשת {hebrewDateInfo.parasha}</span>
                    </>
                )}
            </div>
            
            <div className="w-full">
                <div className="flex justify-between items-center mb-1 text-sm text-gray-300">
                    <span>התקדמות יומית כללית</span>
                    <span className="font-mono">{overallPercentage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div
                        className="bg-cyan-500 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${overallPercentage}%` }}
                    ></div>
                </div>
            </div>

            <div className="flex justify-around items-center pt-2 border-t border-gray-700">
                <button onClick={() => dispatch({ type: 'TOGGLE_SOUND' })} className="p-2 rounded-full hover:bg-gray-700 transition-colors" title={soundOn ? "השתק צלילים" : "הפעל צלילים"}>
                    <Icon name={soundOn ? 'soundOn' : 'soundOff'} className="w-6 h-6 text-cyan-400" />
                </button>
                 <button onClick={() => dispatch({ type: 'TOGGLE_AUTORESET' })} className="p-2 rounded-full hover:bg-gray-700 transition-colors" title={autoReset ? "בטל איפוס אוטומטי" : "הפעל איפוס אוטומטי"}>
                    <Icon name={autoReset ? 'autoResetOn' : 'autoResetOff'} className="w-6 h-6 text-cyan-400" />
                </button>
                <button onClick={() => dispatch({ type: 'RESET_DAY' })} className="p-2 rounded-full hover:bg-gray-700 transition-colors" title="אפס את היום">
                    <Icon name="reset" className="w-6 h-6 text-cyan-400" />
                </button>
                <button onClick={onManageClick} className="p-2 rounded-full hover:bg-gray-700 transition-colors" title="ניהול מסלולים">
                    <Icon name="settings" className="w-6 h-6 text-cyan-400" />
                </button>
                <button onClick={onCalendarClick} className="p-2 rounded-full hover:bg-gray-700 transition-colors" title="לוח שנה היסטורי">
                    <Icon name="calendar" className="w-6 h-6 text-cyan-400" />
                </button>
            </div>
        </header>
    );
};

export default Header;
