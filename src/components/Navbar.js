import { Link, useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return "/";
    switch (user.role) {
      case 'Waiter': return '/waiter-dashboard';
      case 'Chef': return '/chef-dashboard';
      case 'Admin': return '/admin-dashboard';
      default: return '/';
    }
  };

  return (
    <header className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img src="/logo.png" alt="AssitGo Logo" height="40" className="me-2" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          {/* This ul structure is the key to correct responsive behavior */}
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/contact">Contact</Link>
            </li>

            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link nav-link-custom" to={getDashboardPath()}>Dashboard</Link>
                </li>
                <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                  <button className="btn-custom-logout" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                <Link className="nav-link nav-link-custom" to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Navbar;






