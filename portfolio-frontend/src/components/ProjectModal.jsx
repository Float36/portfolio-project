import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProjectModal.css';

const ProjectModal = ({ project = null, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        github_link: '',
        live_link: ''
    });

    const [errors, setErrors] = useState({});

    // Technology states
    const [selectedTechnologies, setSelectedTechnologies] = useState([]);
    const [techSearch, setTechSearch] = useState('');
    const [techSuggestions, setTechSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title || '',
                description: project.description || '',
                github_link: project.github_link || '',
                live_link: project.live_link || ''
            });
            // Load existing technologies
            setSelectedTechnologies(project.technologies || []);
        } else {
            setFormData({
                title: '',
                description: '',
                github_link: '',
                live_link: ''
            });
            setSelectedTechnologies([]);
        }
        setErrors({});
    }, [project]);

    // Search technologies
    useEffect(() => {
        const searchTechnologies = async () => {
            if (techSearch.trim().length < 1) {
                setTechSuggestions([]);
                return;
            }

            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/v1/technologies/?search=${techSearch}`);
                // Filter out already selected technologies
                const filtered = response.data.filter(
                    tech => !selectedTechnologies.some(selected => selected.id === tech.id)
                );
                setTechSuggestions(filtered);
            } catch (err) {
                console.error('Error searching technologies:', err);
            }
        };

        const debounce = setTimeout(searchTechnologies, 300);
        return () => clearTimeout(debounce);
    }, [techSearch, selectedTechnologies]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const addTechnology = (tech) => {
        setSelectedTechnologies(prev => [...prev, tech]);
        setTechSearch('');
        setTechSuggestions([]);
        setShowSuggestions(false);
    };

    const removeTechnology = (techId) => {
        setSelectedTechnologies(prev => prev.filter(t => t.id !== techId));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Це поле є обовʼязковим';
        if (!formData.description.trim()) newErrors.description = 'Це поле є обовʼязковим';
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Prepare data with technology IDs
        const dataToSend = {
            ...formData,
            technology_ids: selectedTechnologies.map(t => t.id)
        };

        // If editing, pass id + data. If creating, pass data.
        if (project) {
            onSave(project.id, dataToSend);
        } else {
            onSave(dataToSend);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{project ? 'Редагувати проєкт' : 'Додати проєкт'}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Назва <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={errors.title ? 'input-error' : ''}
                        />
                        {errors.title && <span className="field-error">{errors.title}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Опис <span style={{ color: 'red' }}>*</span></label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={errors.description ? 'input-error' : ''}
                        />
                        {errors.description && <span className="field-error">{errors.description}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="github_link">GitHub Link</label>
                        <input
                            type="url"
                            id="github_link"
                            name="github_link"
                            value={formData.github_link}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="live_link">Demo Link</label>
                        <input
                            type="url"
                            id="live_link"
                            name="live_link"
                            value={formData.live_link}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Technology Selection */}
                    <div className="form-group">
                        <label htmlFor="tech_search">Технології</label>
                        <div className="tech-input-wrapper">
                            <input
                                type="text"
                                id="tech_search"
                                placeholder="Пошук технологій..."
                                value={techSearch}
                                onChange={(e) => setTechSearch(e.target.value)}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            />
                            {showSuggestions && techSuggestions.length > 0 && (
                                <div className="tech-suggestions">
                                    {techSuggestions.map(tech => (
                                        <div
                                            key={tech.id}
                                            className="tech-suggestion-item"
                                            onClick={() => addTechnology(tech)}
                                        >
                                            {tech.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Selected Technologies */}
                        {selectedTechnologies.length > 0 && (
                            <div className="selected-technologies">
                                {selectedTechnologies.map(tech => (
                                    <span key={tech.id} className="tech-tag">
                                        {tech.name}
                                        <button
                                            type="button"
                                            className="tech-remove"
                                            onClick={() => removeTechnology(tech.id)}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-outline" onClick={onClose}>Скасувати</button>
                        <button type="submit" className="btn-primary">{project ? 'Зберегти' : 'Створити'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectModal;
