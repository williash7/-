import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { Action, LimudState, Subject } from '../types';
import { getHebrewDateInfo, getTodayKey } from '../services/dateService';
import { LOCAL_STORAGE_KEY, BEEP_SOUND_URL, COMPLETE_SOUND_URL } from '../constants';

const initialState: LimudState = {
    subjects: [],
    progress: {},
    activeSubjectId: null,
    activeSeconds: 0,
    soundOn: true,
    autoReset: true,
    lastResetDate: getTodayKey(),
    history: {},
    hebrewDateInfo: { weekdayLabel: '', hebrewDateLabel: '', parasha: '' },
};

const LimudContext = createContext<{ state: LimudState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

const limudReducer = (state: LimudState, action: Action): LimudState => {
    switch (action.type) {
        case 'REPLACE_STATE':
            return action.payload;
        case 'ADD_SUBJECT': {
            const newSubject: Subject = {
                id: crypto.randomUUID(),
                name: action.payload.name,
                minutes: action.payload.minutes
            };
            return {
                ...state,
                subjects: [...state.subjects, newSubject],
                progress: { ...state.progress, [newSubject.id]: 0 }
            };
        }
        case 'UPDATE_SUBJECT': {
            const { id, name, minutes } = action.payload;
            const newSubjects = state.subjects.map(s => s.id === id ? { ...s, name, minutes } : s);
            const newProgress = { ...state.progress };
            if (newProgress[id] > minutes) {
                newProgress[id] = minutes;
            }
            return { ...state, subjects: newSubjects, progress: newProgress };
        }
        case 'DELETE_SUBJECT': {
            const { id } = action.payload;
            const newSubjects = state.subjects.filter(s => s.id !== id);
            const newProgress = { ...state.progress };
            delete newProgress[id];
            return {
                ...state,
                subjects: newSubjects,
                progress: newProgress,
                activeSubjectId: state.activeSubjectId === id ? null : state.activeSubjectId,
                activeSeconds: state.activeSubjectId === id ? 0 : state.activeSeconds,
            };
        }
        case 'DELETE_ALL_SUBJECTS':
            return {
                ...state,
                subjects: [],
                progress: {},
                activeSubjectId: null,
                activeSeconds: 0,
            };
        case 'TOGGLE_TIMER': {
            const { id } = action.payload;
            if (state.activeSubjectId === id) {
                return { ...state, activeSubjectId: null, activeSeconds: 0 };
            }
            return { ...state, activeSubjectId: id, activeSeconds: 0 };
        }
        case 'ADD_MINUTE': {
            const { id } = action.payload;
            const subject = state.subjects.find(s => s.id === id);
            if (!subject) return state;
            const currentProgress = state.progress[id] || 0;
            return {
                ...state,
                progress: {
                    ...state.progress,
                    [id]: Math.min(subject.minutes, currentProgress + 1)
                }
            };
        }
        case 'MARK_COMPLETE': {
            const { id, wasCompleted } = action.payload;
            const subject = state.subjects.find(s => s.id === id);
            if (!subject) return state;
            return {
                ...state,
                progress: {
                    ...state.progress,
                    [id]: wasCompleted ? 0 : subject.minutes
                }
            };
        }
        case 'TICK': {
            if (!state.activeSubjectId) return state;
            const newSeconds = state.activeSeconds + 1;
            if (newSeconds >= 60) {
                const subject = state.subjects.find(s => s.id === state.activeSubjectId);
                if (!subject) return state;
                const currentProgress = state.progress[state.activeSubjectId] || 0;
                const newProgress = Math.min(subject.minutes, currentProgress + 1);

                return {
                    ...state,
                    activeSeconds: 0,
                    progress: { ...state.progress, [state.activeSubjectId]: newProgress },
                    activeSubjectId: newProgress >= subject.minutes ? null : state.activeSubjectId
                };
            }
            return { ...state, activeSeconds: newSeconds };
        }
        case 'STOP_TIMER':
            return { ...state, activeSubjectId: null, activeSeconds: 0 };
        case 'RESET_DAY': {
            const todayKey = state.lastResetDate;
            const newHistoryForDay = { ...state.history[todayKey] };
            
            state.subjects.forEach(subject => {
                const progress = state.progress[subject.id] || 0;
                newHistoryForDay[subject.id] = {
                    done: progress >= subject.minutes,
                    minutes: progress,
                    target: subject.minutes,
                    name: subject.name
                };
            });

            const newProgress = Object.keys(state.progress).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
            
            return {
                ...state,
                progress: newProgress,
                activeSubjectId: null,
                activeSeconds: 0,
                history: { ...state.history, [todayKey]: newHistoryForDay },
                lastResetDate: getTodayKey(),
                hebrewDateInfo: getHebrewDateInfo()
            };
        }
        case 'TOGGLE_SOUND':
            return { ...state, soundOn: !state.soundOn };
        case 'TOGGLE_AUTORESET':
            return { ...state, autoReset: !state.autoReset };
        case 'UPDATE_HEBREW_DATE':
             return { ...state, hebrewDateInfo: getHebrewDateInfo() };
        default:
            return state;
    }
};

const beepAudio = new Audio(BEEP_SOUND_URL);
const completeAudio = new Audio(COMPLETE_SOUND_URL);

export const LimudProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(limudReducer, initialState);
    const stateRef = useRef(state);
    stateRef.current = state;

    useEffect(() => {
        let isMounted = true;
        try {
            const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedState && isMounted) {
                const parsedState = JSON.parse(storedState);
                dispatch({
                    type: 'REPLACE_STATE',
                    payload: {
                        ...initialState,
                        ...parsedState,
                        hebrewDateInfo: initialState.hebrewDateInfo,
                    },
                });
            }
        } catch (error) {
            console.error("Failed to load state from localStorage", error);
        }

        // Poll for Hebcal library to be ready to avoid race condition
        let attempts = 0;
        const maxAttempts = 50; // Poll for 5 seconds max
        const pollInterval = setInterval(() => {
            const hebcalReady = !!(window.Hebcal && window.Hebcal.HDate);
            if (hebcalReady || attempts >= maxAttempts) {
                clearInterval(pollInterval);
                if (isMounted) {
                    dispatch({ type: 'UPDATE_HEBREW_DATE' });
                }
            }
            attempts++;
        }, 100);

        return () => {
            isMounted = false;
            clearInterval(pollInterval);
        };
    }, []);

    useEffect(() => {
        try {
            // Avoid saving the hebrewDateInfo, as it should be fresh on each load
            const stateToSave = { ...state, hebrewDateInfo: undefined };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
        } catch (error) {
            console.error("Failed to save state to localStorage", error);
        }
    }, [state]);

    useEffect(() => {
        const timer = setInterval(() => {
            const currentState = stateRef.current;
            if (currentState.activeSubjectId) {
                dispatch({ type: 'TICK' });
            }
            if (currentState.autoReset && getTodayKey() !== currentState.lastResetDate) {
                dispatch({ type: 'RESET_DAY' });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);
    
    // Sound effect logic
    useEffect(() => {
        if (!state.soundOn) return;
        
        const previousProgress = stateRef.current.progress;
        const currentProgress = state.progress;

        Object.keys(currentProgress).forEach(id => {
            const subject = state.subjects.find(s => s.id === id);
            if (!subject) return;

            const prev = previousProgress[id] || 0;
            const curr = currentProgress[id] || 0;
            
            if (curr > prev) {
                if (curr >= subject.minutes) {
                    completeAudio.play().catch(e => console.error("Error playing sound", e));
                } else {
                    beepAudio.play().catch(e => console.error("Error playing sound", e));
                }
            }
        });
        
    }, [state.progress, state.soundOn, state.subjects]);

    return (
        <LimudContext.Provider value={{ state, dispatch }}>
            {children}
        </LimudContext.Provider>
    );
};

export const useLimud = () => {
    const context = useContext(LimudContext);
    if (context === undefined) {
        throw new Error('useLimud must be used within a LimudProvider');
    }
    return context;
};