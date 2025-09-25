import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaBook, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="nav-bar">
      <div className="nav-logo">
        <Link to="/">MediVerse</Link>
        <span className="subtitle">Health Guide</span>
      </div>
      <div className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          <FaHome /> Home
        </Link>
        <Link to="/symptoms" className={location.pathname === '/symptoms' ? 'active' : ''}>
          <FaSearch /> Symptoms
        </Link>
        <Link to="/library" className={location.pathname === '/library' ? 'active' : ''}>
          <FaBook /> Medicine Library
        </Link>
        <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
          <FaUser /> Profile
        </Link>
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navigation; 