import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './UserHeader.css';

const UserHeader = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header>
            <div className="container">
                <div className="pf-nav d-flex justify-content-between align-items-center py-3">
                    <div className="logo-box">
                        <Link to="/user-profile">
                            <img src="/assets/images/logos/company_logo.png" alt="Logo" style={{ maxHeight: '60px' }} />
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="search-bar d-none d-md-flex align-items-center bg-light rounded-pill px-3 py-2" style={{ width: '400px' }}>
                        <input type="search" className="form-control border-0 bg-transparent" placeholder="Search for Franchises" style={{ outline: 'none' }} />
                        <div className="action-btns d-flex gap-2 text-muted">
                            <i className="bi bi-sliders"></i>
                            <div className="srch-icon-btn">
                                <i className="bi bi-search"></i>
                            </div>
                        </div>
                    </div>

                    <div className="right-part d-flex align-items-center gap-3">
                        <div className="nav-icons d-flex gap-3 text-primary">
                            {/* Icons placeholders using bootstrap icons or svgs */}
                            <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" /></svg>
                            <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" /><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" /></svg>
                        </div>

                        <div className="position-relative">
                            <div className="user-profile-icon-nav" onClick={toggleMenu} role="button">
                                <img src="/assets/images/user-icons/user-icon-pic.png" alt="User" style={{ width: '40px', cursor: 'pointer' }} />
                            </div>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                                <div className="card position-absolute end-0 mt-2 shadow p-3" style={{ width: '300px', zIndex: 1000 }}>
                                    <div className="d-flex align-items-center mb-3">
                                        <img src="/assets/images/user-icons/user-prf-pic.png" alt="Profile" className="rounded-circle me-3" style={{ width: '50px' }} />
                                        <div>
                                            <h6 className="m-0">{user?.first_name} {user?.last_name}</h6>
                                            <small className="text-muted">{user?.email}</small>
                                        </div>
                                    </div>
                                    <Link to="/user-profile" className="btn btn-primary w-100 mb-3">View Profile</Link>
                                    <hr />
                                    <div className="mb-2">
                                        <h6 className="text-muted text-uppercase small">Manage</h6>
                                        <Link to="#" className="d-block text-decoration-none text-dark mb-1">Franchisor</Link>
                                        <Link to="#" className="d-block text-decoration-none text-dark mb-1">Franchise</Link>
                                        <Link to="#" className="d-block text-decoration-none text-dark">Leads</Link>
                                    </div>
                                    <div className="mb-2">
                                        <h6 className="text-muted text-uppercase small">Account</h6>
                                        <Link to="#" className="d-block text-decoration-none text-dark mb-1">Setting & Privacy</Link>
                                        <Link to="#" className="d-block text-decoration-none text-dark">Help</Link>
                                    </div>
                                    <hr />
                                    <div className="d-flex align-items-center text-danger" role="button" onClick={logout}>
                                        <svg width="20" height="20" fill="currentColor" className="me-2" viewBox="0 0 16 16"><path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" /><path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" /></svg>
                                        Sign Out
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default UserHeader;
