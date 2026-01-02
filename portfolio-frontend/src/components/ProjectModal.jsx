import React, { useState, useEffect } from 'react';
import './ProjectModal.css';

const ProjectModal = ({ project = null, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        github_link: '',
        live_link: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title || '',
                description: project.description || '',
                github_link: project.github_link || '',
                live_link: project.live_link || ''
            });
        } else {
            setFormData({
                title: '',
                description: '',
                github_link: '',
                live_link: ''
            });
        }
        setErrors({});
    }, [project]);

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

        // If editing, pass id + data. If creating, pass data.
        if (project) {
            onSave(project.id, formData);
        } else {
            onSave(formData);
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
