import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Невірний логін або пароль');
    }
  };

  return (
    <div className="container">
      <div className="auth-container">
        <h2>Вхід у DevHub</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Керуйте своїми проєктами</p>

        {error && <p className="error-msg">{error}</p>}

        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Логін"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary">Увійти</button>
        </form>
        <div style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Немає акаунту? <Link to="/register" style={{ color: 'var(--accent)' }}>Зареєструватися</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;