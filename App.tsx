
import React, { useState } from 'react';
import { LimudProvider, useLimud } from './hooks/useLimudState';
import Header from './components/Header';
import SubjectList from './components/SubjectList';
import ManageSubjectsModal from './components/ManageSubjectsModal';
import CalendarModal from './components/CalendarModal';

const AppContent: React.FC = () => {
    const { state } = useLimud();
    const [isManageModalOpen, setManageModalOpen] = useState(false);
    const [isCalendarModalOpen, setCalendarModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 max-w-2xl mx-auto flex flex-col">
            <Header
                onManageClick={() => setManageModalOpen(true)}
                onCalendarClick={() => setCalendarModalOpen(true)}
            />
            <main className="flex-grow mt-4">
                <SubjectList />
            </main>

            {isManageModalOpen && (
                <ManageSubjectsModal onClose={() => setManageModalOpen(false)} />
            )}

            {isCalendarModalOpen && (
                <CalendarModal onClose={() => setCalendarModalOpen(false)} />
            )}
        </div>
    );
};


const App: React.FC = () => {
    return (
        <LimudProvider>
            <AppContent />
        </LimudProvider>
    );
};

export default App;
