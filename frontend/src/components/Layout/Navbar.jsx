import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { HiUserGroup } from 'react-icons/hi';
import './Navbar.css';

function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <h2>LinkedIn</h2>
          </Link>
        </div>

        <div className="navbar-center">
          <Link to="/" className="navbar-link">
            <span className="icon"><AiFillHome /></span>
            <span>Home</span>
          </Link>
          <Link to="/network" className="navbar-link">
            <span className="icon"><HiUserGroup /></span>
            <span>My Network</span>
          </Link>
        </div>

        <div className="navbar-right">
          {user && (
            <Link to={`/profile/${user.id}`} className="navbar-profile">
              <div className="navbar-avatar">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.firstName} />
                ) : (
                  <span>{user.firstName[0]}{user.lastName[0]}</span>
                )}
              </div>
              <span className="navbar-username">Me</span>
            </Link>
          )}
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
