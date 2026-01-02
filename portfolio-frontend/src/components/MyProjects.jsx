import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

const MyProjects = ({ user }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);

    const fetchProjects = async (urlOverride = null) => {
        try {
            // We assume user object has username. AuthContext usually provides user.user.username or similar.
            // Let's check safely.
            const username = user?.user?.username || user?.username;
            if (!username) {
                console.error("No username found for filtering projects");
                return;
            }

            const url = urlOverride || `projects/?username=${username}`;
            const response = await api.get(url);

            if (response.data.results) {
                setProjects(response.data.results);
                setNextPage(response.data.next);
                setPrevPage(response.data.previous);
            } else {
                setProjects(response.data);
            }
        } catch (err) {
            console.error(err);
            setError('Не вдалося завантажити проєкти');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchProjects();
    }, [user]);

    const handleSyncGithub = async () => {
        setSyncing(true);
        setError('');
        setSuccess('');
        try {
            const response = await api.post('projects/sync_github/');
            setSuccess(`Синхронізовано: ${response.data.total_synced}, Нових: ${response.data.newly_created}`);
            fetchProjects();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Помилка синхронізації. Перевірте GitHub URL у налаштуваннях.');
        } finally {
            setSyncing(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Ви впевнені, що хочете видалити цей проєкт?')) return;
        try {
            await api.delete(`projects/${id}/`);
            setProjects(projects.filter(p => p.id !== id));
        } catch (err) {
            alert('Помилка видалення');
        }
    };

    const handleSaveProject = async (dataOrId, dataIfUpdate) => {
        // If dataIfUpdate exists, it's an update (id, data)
        // If not, it's a create (data)
        const isUpdate = !!dataIfUpdate;

        try {
            if (isUpdate) {
                const id = dataOrId;
                const data = dataIfUpdate;
                const response = await api.patch(`projects/${id}/`, data);
                setProjects(projects.map(p => (p.id === id ? response.data : p)));
                setSuccess('Проєкт успішно оновлено!');
            } else {
                const data = dataOrId;
                const response = await api.post('projects/', data);
                setProjects([response.data, ...projects]);
                setSuccess('Проєкт успішно створено!');
            }

            setIsModalOpen(false);
            setEditingProject(null);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error(err);
            alert('Помилка збереження проєкту');
        }
    };

    const openCreateModal = () => {
        setEditingProject(null);
        setIsModalOpen(true);
    };

    const openEditModal = (project) => {
        setEditingProject(project);
        setIsModalOpen(true);
    };

    if (loading) return <div>Завантаження...</div>;

    return (
        <div>
            <div className="projects-controls">
                <h2>Мої Проєкти</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className="btn-primary"
                        onClick={handleSyncGithub}
                        disabled={syncing}
                    >
                        {syncing ? 'Синхронізація...' : 'Синхронізувати з GitHub'}
                    </button>
                    <button className="btn-outline" onClick={openCreateModal}>Додати вручну</button>
                </div>
            </div>

            {error && <div className="error-msg" style={{ marginBottom: '1rem' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: '1rem', padding: '10px', background: 'rgba(0,255,0,0.1)', borderRadius: '8px' }}>{success}</div>}

            {projects.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>У вас поки немає проєктів. Синхронізуйте з GitHub або додайте вручну.</p>
            ) : (
                <div className="projects-grid">
                    {projects.map(project => (
                        <ProjectCard key={project.id} project={project}>
                            <div className="project-actions">
                                <button className="btn-outline btn-small" onClick={() => openEditModal(project)}>Редагувати</button>
                                <button className="btn-danger btn-small" onClick={() => handleDelete(project.id)}>Видалити</button>
                            </div>
                        </ProjectCard>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px', marginBottom: '20px' }}>
                <button
                    disabled={!prevPage}
                    onClick={() => fetchProjects(prevPage)}
                    className="btn-outline"
                    style={{ opacity: !prevPage ? 0.5 : 1, cursor: !prevPage ? 'default' : 'pointer' }}
                >
                    Назад
                </button>
                <button
                    disabled={!nextPage}
                    onClick={() => fetchProjects(nextPage)}
                    className="btn-outline"
                    style={{ opacity: !nextPage ? 0.5 : 1, cursor: !nextPage ? 'default' : 'pointer' }}
                >
                    Далі
                </button>
            </div>

            {isModalOpen && (
                <ProjectModal
                    project={editingProject}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveProject}
                />
            )}
        </div>
    );
};

export default MyProjects;
