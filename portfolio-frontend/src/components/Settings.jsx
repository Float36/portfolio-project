import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Settings = ({ user }) => {
    const { refreshUser } = useAuth();
    const [formData, setFormData] = useState({
        bio: '',
        github_url: '',
        linkedin_url: '',
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeFileName, setResumeFileName] = useState(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                bio: user.bio || '',
                github_url: user.github_url || '',
                linkedin_url: user.linkedin_url || '',
            });
            if (user.profile_picture) {
                setAvatarPreview(user.profile_picture);
            }
            if (user.resume_cv) {
                const fileName = user.resume_cv.split('/').pop();
                setResumeFileName(fileName);
            }
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleResumeChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setResumeFile(file);
            setResumeFileName(file.name);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ type: '', text: '' });

        const data = new FormData();
        data.append('bio', formData.bio);
        data.append('github_url', formData.github_url);
        data.append('linkedin_url', formData.linkedin_url);

        if (avatarFile) {
            data.append('profile_picture', avatarFile);
        }

        if (resumeFile) {
            data.append('resume_cv', resumeFile);
        }

        try {
            const response = await api.patch(`profiles/${user.id}/`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMsg({ type: 'success', text: 'Профіль успішно оновлено' });
            await refreshUser();
        } catch (err) {
            console.error(err);
            setMsg({ type: 'error', text: 'Помилка збереження' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>Налаштування Профілю</h2>
            <form className="settings-form" onSubmit={handleSubmit}>
                {msg.text && (
                    <div style={{
                        padding: '10px',
                        marginBottom: '1rem',
                        borderRadius: '6px',
                        background: msg.type === 'error' ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,0,0.1)',
                        color: msg.type === 'error' ? 'red' : 'green'
                    }}>
                        {msg.text}
                    </div>
                )}

                <div className="form-group" style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        margin: '0 auto 10px',
                        background: '#333',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span style={{ fontSize: '2rem' }}>👤</span>
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        id="avatar-upload"
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="avatar-upload" className="btn-outline" style={{ cursor: 'pointer', display: 'inline-block' }}>
                        Змінити фото
                    </label>
                </div>

                <div className="form-group">
                    <label>GitHub URL (Для синхронізації)</label>
                    <input
                        type="url"
                        name="github_url"
                        value={formData.github_url}
                        onChange={handleChange}
                        placeholder="https://github.com/username"
                    />
                    <small style={{ color: 'var(--text-muted)' }}>Обов'язкове поле для роботи синхронізації проєктів.</small>
                </div>

                <div className="form-group">
                    <label>Про себе (Bio)</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Розкажіть трохи про себе..."
                    />
                </div>

                <div className="form-group">
                    <label>LinkedIn URL</label>
                    <input
                        type="url"
                        name="linkedin_url"
                        value={formData.linkedin_url}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Резюме (PDF)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleResumeChange}
                            id="resume-upload"
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="resume-upload" className="btn-outline" style={{ cursor: 'pointer', margin: 0 }}>
                            Вибрати файл
                        </label>
                        {resumeFileName && (
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                Резюме завантажено
                            </span>
                        )}
                    </div>
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Збереження...' : 'Зберегти зміни'}
                </button>
            </form>
        </div>
    );
};

export default Settings;
