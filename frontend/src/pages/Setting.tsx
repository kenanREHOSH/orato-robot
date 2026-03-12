import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LanguagePreferences from '../components/LanguagePreferences'; // For importing Language Preferences component.
import Notifications from '../components/Notifications'; // For importing Notifications component.
import AudioDisplay from '../components/AudioDisplay'; // For importing Audio Display component.
import PrivacyData from '../components/PrivacyData'; // For importing Privacy & Data component.
import AccountActions from '../components/AccountActions'; // For importing Account Actions component.
import backgroundImage from '../assets/settingbg.jpg';

const API = 'http://localhost:5002/api/settings';

const Settings: React.FC = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [notifSettings, setNotifSettings] = useState<any>(undefined);
    const [audioSettings, setAudioSettings] = useState<any>(undefined);
    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            const user = JSON.parse(stored);
            setUserId(user.id || user._id);
            axios.get(`${API}/${user.id}`).then(res => {
                if (res.data.settings) {
                    setNotifSettings(res.data.settings.notifications);
                    setAudioSettings(res.data.settings.audioDisplay);
                }
            }).catch(err => console.error('Failed to load settings:', err));
        }
    }, []);
    const handleNotifChange = async (newSettings: any) => {
        setNotifSettings(newSettings);
        if (userId) {
            try {
                await axios.put(`${API}/${userId}`, { notifications: newSettings });
            } catch (err) {
                console.error('Failed to save notification settings:', err);
            }
        }
    };
    const handleAudioChange = async (newSettings: any) => {
        setAudioSettings(newSettings);
        if (userId) {
            try {
                await axios.put(`${API}/${userId}`, { audioDisplay: newSettings });
            } catch (err) {
                console.error('Failed to save audio settings:', err);
            }
        }
    };
    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed py-8 px-4 sm:px-6 lg:px-8"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Settings</h1>
                    <p className="mt-2 text-white">Customize your learning experience</p>
                </div>
                <div className="space-y-6">
                    <LanguagePreferences />
                    <Notifications settings={notifSettings} onChange={handleNotifChange} />
                    <AudioDisplay settings={audioSettings} onChange={handleAudioChange} />
                    <PrivacyData userId={userId ?? undefined} />
                    <AccountActions userId={userId ?? undefined} />
                </div>
            </div>
        </div>
    );
};

const Setting: React.FC = () => {
    return (
        <div className="page-wrappe">
            <Navbar isLoggedIn={true} />

            <main className="page-container">
                <Settings />
            </main>

            <Footer />
        </div>
    );
};

export default Setting;