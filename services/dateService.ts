import { HebrewDateInfo } from '../types';

// Fix: Globally declare the Hebcal property on the Window object.
// This resolves TypeScript errors when accessing window.Hebcal, which is loaded via a script tag.
declare global {
  interface Window {
    Hebcal: any;
  }
}

export const getTodayKey = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const getHebrewDateInfo = (): HebrewDateInfo => {
  if (!window.Hebcal || !window.Hebcal.HDate) {
    console.warn("Hebcal library not yet available.");
    return {
      weekdayLabel: '',
      hebrewDateLabel: '',
      parasha: ''
    };
  }

  const { HDate, Hebcal } = window.Hebcal;

  const today = new HDate();
  const weekday = today.getDay();
  const weekdays = ['יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי', 'שבת'];

  const hebrewDateStr = today.renderGematriya(false);

  // Find the upcoming Shabbat to get the weekly Parasha
  const upcomingShabbat = today.onOrAfter(6); // 6 = Saturday
  const sedra = new Hebcal.Sedra(upcomingShabbat.getFullYear(), true);
  const parasha = sedra.get(upcomingShabbat).join(' / ');
  
  return {
    weekdayLabel: weekdays[weekday],
    hebrewDateLabel: hebrewDateStr,
    parasha: parasha,
  };
};

export const getDaysInMonth = (year: number, month: number): Date[] => {
    const date = new Date(year, month, 1);
    const days: Date[] = [];
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
};

export const formatYYYYMMDD = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}