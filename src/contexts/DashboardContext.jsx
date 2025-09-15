import React, { createContext, useContext, useState } from 'react';

const DashboardContext = createContext();

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
};

export const DashboardProvider = ({ children }) => {
    const [activeTab, setActiveTab] = useState('home');

    const resetToHome = () => {
        setActiveTab('home');
    };

    const value = {
        activeTab,
        setActiveTab,
        resetToHome
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
};