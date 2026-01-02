import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import ProjectCard from '../components/ProjectCard';
import './PublicProfile.css';

const PublicProfile = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const profileRes = await api.get(`profiles/by-username/${username}/`);
                setProfile(profileRes.data);

                // Initial project fetch
                await fetchProjects(`projects/?username=${username}`);
            } catch (err) {
                console.error(err);
                if (err.response && err.response.status === 404) {
                    setError('Користувача не знайдено');
                } else {
                    setError('Помилка завантаження профілю');
                }
            } finally {
                setLoading(false);
            }
        };

        if (username) fetchProfile();
    }, [username]);

    const fetchProjects = async (url) => {
        try {
            const projectsRes = await api.get(url);
            if (projectsRes.data.results) {
                setProjects(projectsRes.data.results);
                setNextPage(projectsRes.data.next);
                setPrevPage(projectsRes.data.previous);
            } else {
                setProjects(projectsRes.data);
            }
        } catch (err) {
            console.error("Error fetching projects:", err);
        }
    };

    if (loading) return <div className="loading-container">Завантаження...</div>;
    if (error) return <div className="error-container">{error}</div>;
    if (!profile) return null;

    return (
        <div className="public-profile-container">
            <header className="profile-header">
                <div className="profile-info">
                    {profile.profile_picture && (
                        <img src={profile.profile_picture} alt={profile.user.username} className="profile-avatar" />
                    )}
                    <h1>{profile.user.first_name || profile.user.username}</h1>
                    {profile.bio && <p className="profile-bio">{profile.bio}</p>}

                    <div className="profile-links">
                        {profile.github_url && (
                            <a href={profile.github_url} target="_blank" rel="noreferrer" className="profile-link">
                                GitHub
                            </a>
                        )}
                        {profile.linkedin_url && (
                            <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="profile-link">
                                LinkedIn
                            </a>
                        )}
                        {profile.resume_cv && (
                            <a href={profile.resume_cv} target="_blank" rel="noreferrer" className="profile-link">
                                Resume
                            </a>
                        )}
                    </div>
                </div>
            </header>

            <section className="profile-projects">
                <h2>Мої проєкти</h2>
                {projects.length === 0 ? (
                    <p className="no-projects">У цього користувача поки немає публічних проєктів.</p>
                ) : (
                    <div className="projects-grid">
                        {projects.map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </section>

            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '50px' }}>
                <button
                    disabled={!prevPage}
                    onClick={() => fetchProjects(prevPage)}
                    className="profile-link"
                    style={{ opacity: !prevPage ? 0.5 : 1, cursor: !prevPage ? 'default' : 'pointer', background: 'transparent' }}
                >
                    Назад
                </button>
                <button
                    disabled={!nextPage}
                    onClick={() => fetchProjects(nextPage)}
                    className="profile-link"
                    style={{ opacity: !nextPage ? 0.5 : 1, cursor: !nextPage ? 'default' : 'pointer', background: 'transparent' }}
                >
                    Далі
                </button>
            </div>
        </div>
    );
};

export default PublicProfile;
