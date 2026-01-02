import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css'; // Reusing Login styles

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirm_password: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirm_password) {
            setError('Паролі не співпадають');
            return;
        }

        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                // Format error messages from backend
                const messages = Object.values(err.response.data).flat().join(' ');
                setError(messages || 'Помилка реєстрації');
            } else {
                setError('Помилка реєстрації');
            }
        }
    };

    return (
        <div className="container">
            <div className="auth-container">
                <h2>Реєстрація у DevHub</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Створіть свій профіль</p>

                {error && <p className="error-msg">{error}</p>}

                <form className="auth-form" onSubmit={handleRegister}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Логін"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="confirm_password"
                        placeholder="Підтвердіть пароль"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="btn-primary">Зареєструватися</button>
                </form>
                <div style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Вже маєте акаунт? <Link to="/login" style={{ color: 'var(--accent)' }}>Увійти</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
