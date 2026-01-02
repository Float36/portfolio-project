import React, { useState, useEffect } from 'react';
import './ExperienceModal.css';

const ExperienceModal = ({ experience = null, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        start_date: '',
        end_date: '',
        description: ''
    });
    const [isCurrentPosition, setIsCurrentPosition] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (experience) {
            setFormData({
                company: experience.company || '',
                role: experience.role || '',
                start_date: experience.start_date || '',
                end_date: experience.end_date || '',
                description: experience.description || ''
            });
            setIsCurrentPosition(!experience.end_date);
        } else {
            setFormData({
                company: '',
                role: '',
                start_date: '',
                end_date: '',
                description: ''
            });
            setIsCurrentPosition(false);
        }
        setErrors({});
    }, [experience]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleCurrentPositionChange = (e) => {
        setIsCurrentPosition(e.target.checked);
        if (e.target.checked) {
            setFormData(prev => ({ ...prev, end_date: '' }));
            setErrors(prev => ({ ...prev, end_date: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.company.trim()) newErrors.company = "Це поле є обов'язковим";
        if (!formData.role.trim()) newErrors.role = "Це поле є обов'язковим";
        if (!formData.start_date) newErrors.start_date = "Це поле є обов'язковим";

        if (!isCurrentPosition && formData.end_date) {
            if (new Date(formData.end_date) < new Date(formData.start_date)) {
                newErrors.end_date = "Дата закінчення не може бути раніше дати початку";
            }
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const dataToSend = {
            ...formData,
            end_date: isCurrentPosition ? null : formData.end_date || null
        };

        // Always pass two arguments: id (or null) and data
        if (experience) {
            onSave(experience.id, dataToSend);
        } else {
            onSave(null, dataToSend);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{experience ? 'Редагувати досвід' : 'Додати досвід'}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="company">Компанія <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className={errors.company ? 'input-error' : ''}
                        />
                        {errors.company && <span className="field-error">{errors.company}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Посада <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className={errors.role ? 'input-error' : ''}
                        />
                        {errors.role && <span className="field-error">{errors.role}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="start_date">Дата початку <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="date"
                                id="start_date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                className={errors.start_date ? 'input-error' : ''}
                            />
                            {errors.start_date && <span className="field-error">{errors.start_date}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="end_date">Дата закінчення</label>
                            <input
                                type="date"
                                id="end_date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                disabled={isCurrentPosition}
                                className={errors.end_date ? 'input-error' : ''}
                            />
                            {errors.end_date && <span className="field-error">{errors.end_date}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={isCurrentPosition}
                                onChange={handleCurrentPositionChange}
                            />
                            <span>Працюю зараз</span>
                        </label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Опис обов'язків</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-outline" onClick={onClose}>Скасувати</button>
                        <button type="submit" className="btn-primary">{experience ? 'Зберегти' : 'Додати'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExperienceModal;
