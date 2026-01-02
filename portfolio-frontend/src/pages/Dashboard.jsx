import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MyProjects from '../components/MyProjects';
import Settings from '../components/Settings';
import './Dashboard.css';

const Dashboard = () => {
    const { user, loading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('projects');

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [loading, isAuthenticated, navigate]);

    if (loading) return <div className="container">Loading...</div>;
    if (!user) return null;

    return (
        <div className="container dashboard-container">
            <header className="dashboard-header">
                <h1>Особистий кабінет</h1>
                <p className="welcome-text">Вітаємо, {user.user.first_name || user.user.username}!</p>
            </header>

            <div className="dashboard-tabs">
                <button
                    className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
                    onClick={() => setActiveTab('projects')}
                >
                    Мої проєкти
                </button>
                <button
                    className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    Налаштування
                </button>
            </div>

            <div className="dashboard-content">
                {activeTab === 'projects' ? <MyProjects user={user} /> : <Settings user={user} />}
            </div>
        </div>
    );
};

export default Dashboard;
