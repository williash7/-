
export type Subject = {
  id: string;
  name: string;
  minutes: number;
};

export type Progress = Record<string, number>;

export type HistoryEntry = {
  done: boolean;
  minutes: number;
  target: number;
  name: string;
};

export type DailyHistory = Record<string, HistoryEntry>;

export type History = Record<string, DailyHistory>;

export type HebrewDateInfo = {
  weekdayLabel: string;
  hebrewDateLabel: string;
  parasha: string;
};

export type LimudState = {
  subjects: Subject[];
  progress: Progress;
  activeSubjectId: string | null;
  activeSeconds: number;
  soundOn: boolean;
  autoReset: boolean;
  lastResetDate: string;
  history: History;
  hebrewDateInfo: HebrewDateInfo;
};

export type Action =
  | { type: 'REPLACE_STATE'; payload: LimudState }
  | { type: 'ADD_SUBJECT'; payload: { name: string; minutes: number } }
  | { type: 'UPDATE_SUBJECT'; payload: Subject }
  | { type: 'DELETE_SUBJECT'; payload: { id: string } }
  | { type: 'DELETE_ALL_SUBJECTS' }
  | { type: 'TOGGLE_TIMER'; payload: { id: string } }
  | { type: 'ADD_MINUTE'; payload: { id: string } }
  | { type: 'MARK_COMPLETE'; payload: { id: string; wasCompleted: boolean } }
  | { type: 'TICK' }
  | { type: 'STOP_TIMER' }
  | { type: 'RESET_DAY' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'TOGGLE_AUTORESET' }
  | { type: 'UPDATE_HEBREW_DATE' };
