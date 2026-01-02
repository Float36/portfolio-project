import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserSearch from './UserSearch';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="logo">DEV<span>HUB</span></Link>
        <UserSearch />
        <div className="nav-links">
          <Link to="/">Головна</Link>
          <Link to="/explore">Дослідити</Link>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard">Особистий кабінет</Link>
              <div className="user-info" style={{ marginRight: '10px', color: 'var(--text-muted)' }}>
                {user?.user?.username}
              </div>
              <button onClick={handleLogout} className="btn-outline" style={{ padding: '8px 16px' }}>Вийти</button>
            </>
          ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '8px 16px', textDecoration: 'none' }}>Увійти</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;