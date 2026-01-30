import { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="">
            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-light lp-nav-bar p-2">
                    <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
                        <Link className="navbar-brand" to="/">
                            <img
                                className="lp-logo img-fluid"
                                src="/assets/images/logos/company_logo.png"
                                alt="logo"
                                style={{ maxHeight: '60px' }}
                            />
                        </Link>

                        <button
                            className="navbar-toggler border-0"
                            type="button"
                            onClick={toggleMenu}
                            aria-controls="navbarNav"
                            aria-expanded={isMenuOpen}
                            aria-label="Toggle navigation"
                        >
                            {/* Use existing icon or standard hamburger */}
                            <img src="/assets/images/icons/category/humberger.png" alt="menu" style={{ width: '30px' }} />
                        </button>

                        <div className={`collapse navbar-collapse justify-content-end ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
                            <ul className="navbar-nav text-center mt-3 mt-lg-0">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/franchises" onClick={() => setIsMenuOpen(false)}>Franchises</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/consultants" onClick={() => setIsMenuOpen(false)}>Consultants</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/community" onClick={() => setIsMenuOpen(false)}>Community</Link>
                                </li>
                                {/* Add Login/Signup links if needed, or keep them in Hero */}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
