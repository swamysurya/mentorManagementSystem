  import { useAuth } from '../hooks/useAuth';
import '../assets/styles/navbar.css';

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="profile-section">
          <div className="profile-icon">
            <img 
              src="https://ui-avatars.com/api/?name=Mentor&background=0D8ABC&color=fff" 
              alt="Profile" 
              className="avatar"
            />
          </div>
          <div className="profile-info">
            <span className="profile-name">John Doe</span>
            <span className="profile-role">Mentor</span>
          </div>
        </div>
      </div>
      <div className="navbar-right">
        <button onClick={logout} className="logout-button">
          <svg className="logout-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 17L21 12M21 12L16 7M21 12H9M9 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;